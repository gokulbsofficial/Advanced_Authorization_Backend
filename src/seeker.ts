import db from "./config/connection";
import collections from "./config/collections";
import { AdminsData, UsersData } from "./sample-data";
import { AnyError } from "mongodb";
import logger from "./config/logger";

const NAMESPACE = "SEEKER";

const removeAllData = async () => {
  for (let i = 0; i < UsersData.length; i++) {
    await db
      .get()
      ?.collection(collections.USER)
      .deleteMany({ email: UsersData[i].email });
  }
  for (let i = 0; i < AdminsData.length; i++) {
    await db
      .get()
      ?.collection(collections.ADMIN)
      .deleteMany({ email: AdminsData[i].email });
  }
  return;
};

const importData = async () => {
  try {
    /* MONGO connection */
    db.connect(async (err: AnyError) => {
      if (err) {
        logger.error(NAMESPACE, err.message, err);
        process.exit(1);
      } else {
        await removeAllData();
        await db.get()?.collection(collections.USER).insertMany(UsersData);
        await db.get()?.collection(collections.ADMIN).insertMany(AdminsData);
        logger.info(NAMESPACE, "Example data imported to db successully");
        process.exit(0);
      }
    });
  } catch (error) {
    logger.error(NAMESPACE, error.message, error);
    process.exit(1);
  }
};

const destroyData = () => {
  try {
    /* MONGO connection */
    db.connect(async (err: AnyError) => {
      if (err) {
        logger.error(NAMESPACE, err.message, err);
        process.exit(1);
      } else {
        await removeAllData();
        logger.info(NAMESPACE, "Example data destroyed from db successully");
        process.exit(0);
      }
    });
  } catch (error) {
    logger.error(NAMESPACE, error.message, error);
    process.exit(1);
  }
};

if (process.argv[2] === "-d") {
  destroyData();
} else {
  importData();
}
