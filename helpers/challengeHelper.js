
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