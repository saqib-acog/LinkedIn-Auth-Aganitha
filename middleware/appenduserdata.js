import { readFile, writeFile } from "fs/promises";

export async function appendUserData(userData) {
  try {
    const customerDataFile = "customer-data.json";

    let customerData = [];
    try {
      const data = await readFile(customerDataFile, "utf8");
      if (data.trim().length > 0) {
        customerData = JSON.parse(data);
      }
    } catch (error) {
      if (error.code === "ENOENT") {
        customerData = [];
      } else {
        throw error;
      }
    }
    const userDataExists = customerData.some(
      (entry) => entry.sub === userData.sub
    );
    if (!userDataExists) {
      customerData.push(userData);

      await writeFile(customerDataFile, JSON.stringify(customerData, null, 2));
      console.log("User data appended successfully.");
    } else {
      console.log("User data already exists.");
    }
  } catch (error) {
    console.error("Error appending user data:", error);
  }
}
