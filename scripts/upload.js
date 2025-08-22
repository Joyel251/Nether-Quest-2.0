import fs from "fs";
import { parse } from "csv-parse";
import { PrismaClient } from "@prisma/client";

const prisma = new PrismaClient();

fs.createReadStream("C:\\Users\\Jeffery\\Desktop\\Folder\\Downloads\\round1.csv")
  .pipe(parse({ delimiter: ",", from_line: 2 }))
  .on("data", async function (row) {
    console.log(row);
    try {
      const newSubmission = await prisma.round1.create({
        data: {
          teamNumber: Number(row[0]),
          question: row[1],
          answer: row[2],
          clue: row[3],
        },
      });
      console.log(`Successfully created submission for Team #${newSubmission.teamNumber}.`);
    } catch (error) {
      console.error(`Failed to create submission for Team #${row[0]}. Error:`, error);
    }
  })
  .on("end", function () {
    console.log("CSV file successfully processed.");
  })
  .on("error", function (error) {
    console.log(error.message);
  });