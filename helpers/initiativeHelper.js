
const models = require('../models');
const { Op, QueryTypes } = require('sequelize');
const dimension = require('../models/dimension');


exports.getInitiativeIdsByOneDimension = async (dimensionId, initiativeName = null, includeUnpublished = false, cityId = null, subdivisionId = null) => {
  try {

    let sqlQuery = `
      SELECT i.id
      FROM Initiatives as i
      LEFT JOIN Subdivisions s on i.subdivisionId = s.id
      LEFT JOIN Cities c on s.cityId = c.id
      JOIN InitiativeDimensions IniDim ON i.id = IniDim.initiativeId
      WHERE IniDim.dimensionId = :dimensionId AND :otherConditions
      `;


    const otherConditionsArr = []
    let otherConditions = `TRUE`

    if(initiativeName) {
      otherConditionsArr.push(`i.name LIKE '%${initiativeName}%'`)
    }

    if(cityId) {
      otherConditionsArr.push(`i.cityId = ${cityId}`)
    }

    if(subdivisionId) {
      otherConditionsArr.push(`i.subdivisionId = ${subdivisionId}`)
    }

    if(!includeUnpublished) {
      otherConditionsArr.push(`i.publishedAt IS NOT NULL`)
    }

    if(otherConditionsArr.length > 0) {
      otherConditions = otherConditionsArr.join(' AND ')    
    }

    sqlQuery = sqlQuery.replace(/:otherConditions/g, otherConditions)

    const results = await models.sequelize.query(sqlQuery, {
      replacements: { 
        dimensionId,
      },
      type: QueryTypes.SELECT,
    });
    
    return results
  } catch (error) {
    throw error
  }
}

exports.getIdsByTwoDimensions = async (dimensionId1, dimensionId2, initiativeName = null, includeUnpublished = false, cityId = null, subdivisionId = null) => {
  try {
    let sqlQuery = `
      SELECT i.id
      FROM Initiatives i
      LEFT JOIN Subdivisions s on i.subdivisionId = s.id
      LEFT JOIN Cities c on s.cityId = c.id
      JOIN InitiativeDimensions IniDim1 ON i.id = IniDim1.initiativeId
      JOIN InitiativeDimensions IniDim2 ON i.id = IniDim2.initiativeId
      WHERE IniDim1.dimensionId = :dimensionId1
        AND IniDim2.dimensionId = :dimensionId2
        
        AND :otherConditions
        AND NOT EXISTS (
          SELECT 1
          FROM InitiativeDimensions id_extra
          WHERE id_extra.initiativeId = i.id
            AND id_extra.dimensionId NOT IN (:dimensionId1, :dimensionId2)
        );
      `;


    const otherConditionsArr = []
    let otherConditions = `TRUE`
  
    if(initiativeName) {
      otherConditionsArr.push(`i.name LIKE '%${initiativeName}%'`)
    }

    if(cityId) {
      otherConditionsArr.push(`i.cityId = ${cityId}`)
    }
    if(subdivisionId) {
      otherConditionsArr.push(`i.subdivisionId = ${subdivisionId}`)
    }
  
    if(!includeUnpublished) {
      otherConditionsArr.push(`i.publishedAt IS NOT NULL`)
    }
  
    if(otherConditionsArr.length > 0) {
      otherConditions = otherConditionsArr.join(' AND ')    
    }

    sqlQuery = sqlQuery.replace(/:otherConditions/g, otherConditions)

    const results = await models.sequelize.query(sqlQuery, {
      replacements: { dimensionId1, dimensionId2 },
      type: QueryTypes.SELECT,
    });
    
    return results
  } catch (error) {xa
    throw error
  }
}

exports.getIdsWithoutFilteringByDimensions = async (initiativeName = null, includeUnpublished = false, cityId = null, subdivisionId = null) => {
  
  try {
    let sqlQuery = `
      SELECT i.id
      FROM Initiatives as i
      LEFT JOIN Subdivisions s on i.subdivisionId = s.id
      LEFT JOIN Cities c on s.cityId = c.id
      WHERE :otherConditions
    `;  

    const otherConditionsArr = []
    let otherConditions = `TRUE`

    if(initiativeName) {
      otherConditionsArr.push(`i.name LIKE '%${initiativeName}%'`)
    }
    
    if(cityId) {
      otherConditionsArr.push(`i.cityId = ${cityId}`)
    }

    if(subdivisionId) {
      otherConditionsArr.push(`i.subdivisionId = ${subdivisionId}`)
    }

    if(!includeUnpublished) {
      otherConditionsArr.push(`i.publishedAt IS NOT NULL`)
    }

    if(otherConditionsArr.length > 0) {
      otherConditions = otherConditionsArr.join(' AND ')    
    }

    sqlQuery = sqlQuery.replace(/:otherConditions/g, otherConditions)


    const results = await models.sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
    });
    
    return results
  } catch (error) {
    throw error
  }
}

exports.getInitiativesCountByCityAndDimension = async () => {
  try {
    let sqlQuery = `
      SELECT c2.id, id.dimensionId, COUNT(i.id) as 'count'
      FROM Initiatives i 
      LEFT JOIN InitiativeDimensions id ON i.id = id.initiativeId
      LEFT JOIN Cities AS c2 ON i.cityId = c2.id
      WHERE i.publishedAt IS NOT NULL
      GROUP BY c2.id, id.dimensionId
      ORDER BY c2.id ASC, id.dimensionId ASC
    `;
    const results = await models.sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
    });

    return results
  } catch (error) {
    throw error
  }
}

exports.getInitiativesStatsByDimensionBar = async () => {
  try {
    let sqlQuery = `
      SELECT
        d.id,
        c2.id as 'cityId',
        c2.name as 'cityName',
        d.name as 'dimensionName',
        COUNT(id.dimensionId) as 'value',
        (COUNT(id.dimensionId) * 100.0 / SUM(COUNT(id.dimensionId)) OVER (PARTITION BY c2.id)) AS 'percentage'
      FROM Initiatives AS i
      LEFT JOIN InitiativeDimensions AS id ON i.id = id.initiativeId
      LEFT JOIN Dimensions AS d ON id.dimensionId = d.id
      LEFT JOIN Cities AS c2 ON i.cityId = c2.id
      WHERE i.publishedAt IS NOT NULL
      GROUP BY
        d.id,
        c2.id
      ORDER BY
        c2.id ASC,
        d.id ASC
      `;
    const results = await models.sequelize.query(sqlQuery, {
      replacements: { 
      },
      type: QueryTypes.SELECT,
    }); 

    return results
  } catch (error) {
    throw error
  }
}

exports.getInitiativesCountBySubdivision = async (cityId = null) => {
  try {
    let sqlQuery = `
      SELECT s.id AS "subdivisionId", s.name AS "subdivisionName", s.type as "subdivisionType", c.id AS "cityId", c.name AS "cityName", COUNT(CASE WHEN i.publishedAt IS NOT NULL THEN i.id END) AS "count"
      FROM Subdivisions s 
      LEFT JOIN Initiatives i ON i.subdivisionId = s.id 
      LEFT JOIN Cities c ON s.cityId = c.id
      WHERE c.id = :cityId
      GROUP BY s.id
    `;
    const results = await models.sequelize.query(sqlQuery, {
      replacements: { cityId },
      type: QueryTypes.SELECT,
    });

    return results
  } catch (error) {
    throw error
  }
}