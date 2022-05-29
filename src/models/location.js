import neo4j from "neo4j-driver";
import { config } from "dotenv";
import { nanoid } from "nanoid";
config();

const { URL, DB_USERNAME, DB_PASSWORD, DATABASE } = process.env;

const driver = neo4j.driver(URL, neo4j.auth.basic(DB_USERNAME, DB_PASSWORD));

const findAll = async () => {
  const session = driver.session({ DATABASE });
  const result = await session.run(`MATCH (n:Location) RETURN n`);
  session.close();
  return result.records.map((i) => i.get("n").properties);
};

const findById = async (id) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (n:Location {_id: "${id}"}) RETURN n LIMIT 1`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const create = async (obj) => {
  const session = driver.session({ DATABASE });
  const writeParm = (parm) => parm || "NULL";

  const result = await session.run(
    `MERGE (n:Location {name:"${obj.name}"}) ON CREATE SET n._id= "${nanoid(
      8
    )}", n.address= "${writeParm(obj.address)}", n.lon= ${
      obj.lon
    }, n.lat= ${writeParm(obj.lat)} RETURN n`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const findByIdAndUpdate = async (id, obj) => {
  const session = driver.session({ DATABASE });
  // n.name = "${obj.name}", n.address="${obj.address}"
  const result = await session.run(
    `MATCH (n:Location {_id: "${id}"}) SET n.name= "${
      obj.name
    }", n.address= "${writeParm(obj.address)}", n.lon= ${
      obj.lon
    }, n.lat= ${writeParm(obj.lat)} RETURN n`
  );
  session.close();
  return result.records[0].get("n").properties;
};

const findBYIdAndDelete = async (id) => {
  const session = driver.session({ DATABASE });
  await session.run(`MATCH (n:Location {_id: "${id}"}) DETACH DELETE n`);
  session.close();
  return 1;
};

const findHotel = async (id) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(
    `MATCH (h:Hotel)-[:LOCATED_IN]->(l:Location {_id: "${id}"}) RETURN h`
  );
  session.close();
  return result.records[0].get("h").properties;
};

const findLocality = async (id) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(`
  MATCH (l:Location {_id: "${id}"})-[:POSITIONED_IN]->(lo:Locality)
  RETURN lo
  `);
  session.close();
  return result.records.map((i) => i.get("lo").properties);
};

const createRelationshipToLocality = async (locationId, localityId) => {
  const session = driver.session({ DATABASE });
  const result = await session.run(`
  MATCH (l:Location {_id: "${locationId}"}),
  (lo:Locality {_id: "${localityId}"})
  MERGE (l)-[r:POSITIONED_IN]->(lo)
  RETURN l, r, lo
  `);
  session.close();
  return result.records;
};

export default {
  findAll,
  findById,
  create,
  findByIdAndUpdate,
  findBYIdAndDelete,
  findHotel,
  findLocality,
  createRelationshipToLocality,
};
