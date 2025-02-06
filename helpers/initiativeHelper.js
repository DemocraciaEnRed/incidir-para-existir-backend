
const models = require('../models');
const { Op, QueryTypes } = require('sequelize');
const dimension = require('../models/dimension');


exports.getInitiativeIdsByOneDimension = async (dimensionId, initiativeName = null, includeUnpublished = false, cityId = null, subdivisionId = null) => {
  try {
    console.log(dimensionId)
    console.log(initiativeName)
    console.log(includeUnpublished)
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

    if(subdivisionId) {
      otherConditionsArr.push(`i.subdivisionId = ${subdivisionId}`)
    } else {
      if(cityId) {
        otherConditionsArr.push(`c.id = ${cityId}`)
      }
    }

    if(!includeUnpublished) {
      otherConditionsArr.push(`i.publishedAt IS NOT NULL`)
    }

    if(otherConditionsArr.length > 0) {
      otherConditions = otherConditionsArr.join(' AND ')    
    }

    sqlQuery = sqlQuery.replace(/:otherConditions/g, otherConditions)

    console.log(sqlQuery)

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

    if(subdivisionId) {
      otherConditionsArr.push(`i.subdivisionId = ${subdivisionId}`)
    } else {
      if(cityId) {
        otherConditionsArr.push(`c.id = ${cityId}`)
      }
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
    
    console.log(results)
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

    if(subdivisionId) {
      otherConditionsArr.push(`i.subdivisionId = ${subdivisionId}`)
    } else {
      if(cityId) {
        otherConditionsArr.push(`c.id = ${cityId}`)
      }
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