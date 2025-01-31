
const models = require('../models');
const { Op, QueryTypes } = require('sequelize');
const dimension = require('../models/dimension');


exports.getChallengeIdsByOneDimension = async (dimensionId, challengeName = null, includeUnpublished = false) => {
  try {
    let sqlQuery = `
      SELECT c.id
      FROM Challenges as c
      WHERE c.dimensionId = :dimensionId AND :otherConditions
      `;


    const otherConditionsArr = []
    let otherConditions = `TRUE`

    if(challengeName) {
      otherConditionsArr.push(`c.name LIKE '%${challengeName}%'`)
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

exports.getIdsWithoutFilteringByDimensions = async (challengeName = null) => {
  
  try {
    let sqlQuery = `
      SELECT c.id
      FROM Challenges as c
      WHERE :otherConditions
    `;  

    const otherConditionsArr = []
    let otherConditions = `TRUE`

    if(challengeName) {
      otherConditionsArr.push(`c.name LIKE '%${challengeName}%'`)
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