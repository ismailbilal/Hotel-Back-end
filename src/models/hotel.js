import neo4j from "neo4j-driver";
import { config } from "dotenv";
import { nanoid } from "nanoid";
config();

const { URL, DB_USERNAME, DB_PASSWORD, DATABASE } = process.env;

const driver = neo4j.driver(URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));

const findAll = async (sortingType = "name", order = "asc", name = "") => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (n:Hotel) WHERE n.name =~ '(?i)${name}.*'  RETURN n ORDER BY n.${sortingType} ${order} LIMIT 10`
  );
  session.close();
  return result.records.map((i) => i.get("n").properties);
};

const findById = async (id) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (n:Hotel {_id: "${id}"}) RETURN n LIMIT 1`
  );
  session.close();
  return result.records[0]?.get("n").properties;
};

const create = async (obj) => {
  const session = driver.session({ DATABASE });
  const writeParm = (parm) => parm || "NULL";

  const result = await session.run(
    `MERGE (n:Hotel {name:"${obj.name}"}) ON CREATE SET n._id= "${nanoid(
      8
    )}", n.rating= ${writeParm(obj.rating)}, n.reviewCount= ${
      obj.reviewCount
    }, n.webSite= "${writeParm(obj.webSite)}", n.phoneNumber= "${
      obj.phoneNumber
    }", n.imageUrl= "${writeParm(obj.imageUrl)}" RETURN n`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const findByIdAndUpdate = async (id, obj) => {
  const session = driver.session({ DATABASE });
  // n.name = "${obj.name}", n.address="${obj.address}"
  const result = await session.run(
    `MATCH (n:Hotel {_id: "${id}"}) SET n.name= "${obj.name}", n.rating= ${obj.rating}, n.reviewCount= ${obj.reviewCount}, n.webSite= "${obj.webSite}", n.phoneNumber= "${obj.phoneNumber}", n.imageUrl= "${obj.imageUrl}" RETURN n`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const findBYIdAndDelete = async (id) => {
  const session = driver.session({ DATABASE });
  await session.run(`MATCH (n:Hotel {_id: "${id}"}) DELETE n`);
  session.close();
  return await findAll();
};

const findLocation = async (id) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (h:Hotel {_id: "${id}"})-[:LOCATED_IN]->(l:Location) RETURN l`
  );
  session.close();
  return result.records[0].get("l").properties;
};

const createReletionshipToLocation = async (hotelId, locationId) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(`match (h:Hotel {_id: "${hotelId}"}),
  (l:Location {_id: "${locationId}"})
  merge (h)-[r:LOCATED_IN]->(l)
  return h, r, l`);
  session.close();
  return result.records[0].get("r").properties;
};

const getReviews = async (hotelId) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (u:User)-[r:HAS_RATED]->(h:Hotel {_id: "${hotelId}"}) RETURN r, u ORDER BY r.date DESC`
  );
  session.close();
  return result.records?.map((i) => {
    const review = i.get("r").properties;
    review.username = i.get("u").properties.username;
    return review;
  });
};

export default {
  findAll,
  findById,
  create,
  findByIdAndUpdate,
  findBYIdAndDelete,
  findLocation,
  createReletionshipToLocation,
  getReviews,
};
