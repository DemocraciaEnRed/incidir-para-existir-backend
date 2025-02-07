
const models = require('../models');
const { Op, QueryTypes } = require('sequelize');
const dimension = require('../models/dimension');


exports.getChallengeIdsByOneDimension = async (dimensionId, challengeName = null, cityId = null, subdivisionId = null) => {
  try {
    let sqlQuery = `
      SELECT c.id
      FROM Challenges as c
      LEFT JOIN Subdivisions as s on c.subdivisionId = s.id
      LEFT JOIN Cities as ci on s.cityId = ci.id
      WHERE c.dimensionId = :dimensionId AND :otherConditions
      `;


    const otherConditionsArr = []
    let otherConditions = `TRUE`

    if(challengeName) {
      otherConditionsArr.push(`c.inWords LIKE '%${challengeName}%'`)
    }

    if(subdivisionId) {
      otherConditionsArr.push(`c.subdivisionId = ${subdivisionId}`)
    } else {
      if(cityId) {
        otherConditionsArr.push(`ci.id = ${cityId}`)
      }
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

exports.getIdsWithoutFilteringByDimensions = async (challengeName = null, cityId = null, subdivisionId = null) => {
  
  try {
    let sqlQuery = `
      SELECT c.id
      FROM Challenges as c
      LEFT JOIN Subdivisions as s on c.subdivisionId = s.id
      LEFT JOIN Cities as ci on s.cityId = ci.id
      WHERE :otherConditions
    `;  

    const otherConditionsArr = []
    let otherConditions = `TRUE`

    if(challengeName) {
      otherConditionsArr.push(`c.inWords LIKE '%${challengeName}%'`)
    }

    if(subdivisionId) {
      otherConditionsArr.push(`c.subdivisionId = ${subdivisionId}`)
    } else {
      if(cityId) {
        otherConditionsArr.push(`ci.id = ${cityId}`)
      }
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
      LEFT JOIN Subdivisions AS s ON c.subdivisionId = s.id 
      LEFT JOIN Cities AS c2 ON s.cityId = c2.id
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
      SELECT s.id AS "subdivisionId", s.name AS "subdivisionName", s.type as "subdivisionType", c.id AS "cityId", c.name AS "cityName", COUNT(c2.id) AS "count"
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
