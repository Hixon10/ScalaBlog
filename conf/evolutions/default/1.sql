# Cars schema

# --- !Ups

CREATE TABLE "category" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "title" VARCHAR NOT NULL
  )

CREATE TABLE "post" (
    "id" SERIAL NOT NULL PRIMARY KEY,
    "title" VARCHAR NOT NULL,
    "content" VARCHAR NOT NULL,
    "categoryId" SERIAL REFERENCES "category" (id)
  )

# --- !Downs

DROP TABLE "category";
DROP TABLE "post";

