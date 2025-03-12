
const models = require('../models');
const { Op, QueryTypes } = require('sequelize');
const dimension = require('../models/dimension');


exports.getChallengeIdsByOneDimension = async (dimensionId, challengeName = null, includeUnpublished = false, cityId = null, subdivisionId = null) => {
  try {
    let sqlQuery = `
      SELECT c.id
      FROM Challenges as c
      LEFT JOIN Subdivisions as s on c.subdivisionId = s.id
      LEFT JOIN Cities as ci on c.cityId = ci.id
      WHERE c.dimensionId = :dimensionId AND :otherConditions
      `;


    const otherConditionsArr = []
    let otherConditions = `TRUE`

    if(challengeName) {
      otherConditionsArr.push(`c.inWords LIKE '%${challengeName}%'`)
    }

    if(!includeUnpublished) {
      otherConditionsArr.push(`c.publishedAt IS NOT NULL`)
    }

    if(cityId) {
      otherConditionsArr.push(`c.cityId = ${cityId}`)
    }
    if(subdivisionId) {
      otherConditionsArr.push(`c.subdivisionId = ${subdivisionId}`)
    } else {
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

exports.getIdsWithoutFilteringByDimensions = async (challengeName = null, includeUnpublished = false, cityId = null, subdivisionId = null) => {
  
  try {
    let sqlQuery = `
      SELECT c.id
      FROM Challenges as c
      LEFT JOIN Subdivisions as s on c.subdivisionId = s.id
      LEFT JOIN Cities as ci on c.cityId = ci.id
      WHERE :otherConditions
    `;  

    const otherConditionsArr = []
    let otherConditions = `TRUE`

    if(challengeName) {
      otherConditionsArr.push(`c.inWords LIKE '%${challengeName}%'`)
    }
    
    if(cityId) {
      otherConditionsArr.push(`c.cityId = ${cityId}`)
    }
    if(subdivisionId) {
      otherConditionsArr.push(`c.subdivisionId = ${subdivisionId}`)
    }

    if(!includeUnpublished) {
      otherConditionsArr.push(`c.publishedAt IS NOT NULL`)
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

exports.getChallengesCountByCityAndDimension = async () => {
  try {
    let sqlQuery = `
      SELECT c.id, d.id as 'dimensionId', COUNT(i.id) as 'count'
      FROM Challenges i 
      LEFT JOIN Dimensions d ON i.dimensionId = d.id
      LEFT JOIN Cities AS c ON i.cityId = c.id
      WHERE i.publishedAt IS NOT NULL
      GROUP BY c.id, d.id
      ORDER BY c.id ASC, d.id ASC
    `;
    const results = await models.sequelize.query(sqlQuery, {
      type: QueryTypes.SELECT,
    });

    return results
  } catch (error) {
    throw error
  }
}

exports.getChallengesStatsByDimensionBar = async () => {
  try {
    let sqlQuery = `
      SELECT 
        c.dimensionId, 
        c2.id as 'cityId',
        c2.name as 'cityName',
        d.name as 'dimensionName',
        COUNT(c.dimensionId) as 'value', 
        (COUNT(c.dimensionId) * 100.0 / SUM(COUNT(c.dimensionId)) OVER (PARTITION BY c2.id)) AS 'percentage'
      FROM Challenges AS c
      LEFT JOIN Dimensions AS d ON c.dimensionId = d.id 
      LEFT JOIN Cities AS c2 ON c.cityId = c2.id
      WHERE c.publishedAt IS NOT NULL
      GROUP BY c.dimensionId, c2.id
      ORDER BY c2.id ASC, c.dimensionId ASC
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

exports.getChallengesCountBySubdivision = async (cityId = null) => {
  try {
    let sqlQuery = `
      SELECT s.id AS "subdivisionId", s.name AS "subdivisionName", s.type as "subdivisionType", c.id AS "cityId", c.name AS "cityName",  COUNT(CASE WHEN c2.publishedAt IS NOT NULL THEN c2.id END) AS "count"
      FROM Subdivisions s 
      LEFT JOIN Challenges c2 ON c2.subdivisionId = s.id 
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
