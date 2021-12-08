import React from "react";
import {
  Box,
  Flex,
  Stack,
  HStack,
  Link,
  useColorModeValue,
} from "@chakra-ui/react";
import ThemeToggle from "./ThemeToggle";
import WalletConnectButton from "./WalletConnectButton";

const Links = [
  { text: "About Me", route: "/aboutme" },
  { text: "Projects", route: "/projects" },
];

const NavLink = ({ children }) => (
  <Link
    px={2}
    py={1}
    rounded={"md"}
    _hover={{
      textDecoration: "none",
      bg: useColorModeValue("gray.200", "gray.700"),
    }}
    href={children.route}
  >
    {children.text}
  </Link>
);

export default function NavBar(props) {
  return (
    <>
      <Box bg={useColorModeValue("gray.100", "gray.900")} px={4}>
        <Flex h={16} alignItems={"center"} justifyContent={"space-between"}>
          <HStack spacing={8} alignItems={"center"}>
            <HStack
              as={"nav"}
              spacing={4}
              display={{ base: "none", md: "flex" }}
            >
              {Links.map((link) => (
                <NavLink key={link}>{link}</NavLink>
              ))}
            </HStack>
          </HStack>
          <Flex alignItems={"center"}>
            <Stack direction={"row"} spacing={7}>
              <WalletConnectButton />
              <ThemeToggle />
            </Stack>
          </Flex>
        </Flex>
      </Box>
    </>
  );
}
