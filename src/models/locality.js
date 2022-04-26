import neo4j from "neo4j-driver";
import { config } from "dotenv";
import { nanoid } from "nanoid";
config();

const { url, db_username, db_password, database } = process.env;

const driver = neo4j.driver(url, neo4j.auth.basic(db_username, db_password));
const session = driver.session({ database });

const findAll = async () => {
  const result = await session.run(`MATCH (n:Locality) RETURN n`);
  return result.records.map((i) => i.get("n").properties);
};

const findById = async (id) => {
  const result = await session.run(
    `MATCH (n:Locality {_id: "${id}"}) RETURN n LIMIT 1`
  );
  return result.records[0].get("n").properties;
};

const create = async (obj) => {
  const writeParm = (parm) => parm || "NULL";

  const result = await session.run(
    `MERGE (n:Locality {name:"${obj.name}"}) ON CREATE SET n._id= "${nanoid(
      8
    )}" RETURN n`
  );
  return result.records[0].get("n").properties;
};

const findByIdAndUpdate = async (id, obj) => {
  // n.name = "${obj.name}", n.address="${obj.address}"
  const result = await session.run(
    `MATCH (n:Locality {_id: "${id}"}) SET n.name= "${obj.name}" RETURN n`
  );
  return result.records[0].get("n").properties;
};

const findBYIdAndDelete = async (id) => {
  await session.run(`MATCH (n:Locality {_id: "${id}"}) DELETE n`);
  return await findAll();
};

const findLocation = async (id) => {
  const result = await session.run(
    `MATCH (l:Locality {_id: "${id}"})<-[:POSITIONED_IN]-(lo:Location) RETURN lo`
  );
  return result.records.map((i) => i.get("lo").properties);
};

const createRelationshipToCity = async (localityId, cityId) => {
  const result = await session.run(
    `MATCH (l:Locality {_id: "${localityId}"}),
    (c:City {_id: "${cityId}"})
    MERGE (l)-[r:EXIST_IN]->(c)
    RETURN l, r, c`
  );
  return result.records;
};

const findCity = async (id) => {
  const result = await session.run(
    `MATCH (l:Locality {_id: "${id}"})-[:EXIST_IN]->(c:City) RETURN c`
  );
  return result.records[0].get("c").properties;
};

export default {
  findAll,
  findById,
  create,
  findByIdAndUpdate,
  findBYIdAndDelete,
  findLocation,
  createRelationshipToCity,
  findCity,
};
