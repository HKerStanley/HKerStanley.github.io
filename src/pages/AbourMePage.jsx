import React from "react";
import { Heading } from "@chakra-ui/react";

export default function AbourMePage() {
  return (
    <>
      <Heading>About Me</Heading>
      <span role="img" aria-label="hand waving">
        👋
      </span>{" "}
      Hey there! I am Stanley!
      <div className="bio">
        I am Stanley from Hong Kong! I love coding, games, basketball and food!
        <br />
        Wave at me and lets be friend!
      </div>
    </>
  );
}
