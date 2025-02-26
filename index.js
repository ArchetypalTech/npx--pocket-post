#!/usr/bin/env node
import { readFileSync, existsSync } from "fs";
import PocketBase from "pocketbase";
const pb = new PocketBase("https://pb.cycocyan.xyz");
const METAFILE = "./meta.json";
const { EMAIL, PASSWORD } = process.env;

console.log(process.argv[2]);

const authData = await pb
  .collection("_superusers")
  .authWithPassword(EMAIL, PASSWORD);

if (existsSync(METAFILE)) {
  const raw = readFileSync(METAFILE, "utf-8");
  let data = JSON.parse(raw);
  const request = `title="${data.title}"`;
  try {
    const record = await pb
      .collection("Microsite_Meta")
      .getFirstListItem(request);
    await pb.collection("Microsite_Meta").update(record.id, { ...data });
  } catch (error) {
    if (error.status === 404)
      await pb.collection("Microsite_Meta").create(data);
  }

  // logout
  pb.authStore.clear();
}

// // "mrjcnicolas@gmail.com", "lamepass"
