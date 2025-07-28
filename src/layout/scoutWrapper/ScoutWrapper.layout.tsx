"use client";

import { useQueryClient } from "@tanstack/react-query";
import { useSearchParams } from "next/navigation";
import React, { useEffect } from "react";
import io from "socket.io-client";
import { logout, useUser } from "@/state/auth";
import { useSocketStore } from "@/state/socket";
import useApi from "@/hooks/useApi";

type Props = {
  children: React.ReactNode;
};

const ScoutWrapper = (props: Props) => {
  const queryClient = useQueryClient();

  // Set up state
  const searchParams = useSearchParams();
  const token = searchParams.get("token") as string;
  const { data: loggedInData, isLoading: userIsLoading } = useUser(token);

  // Fetch scout profile
  const scoutProfileQuery = useApi({
    method: "GET",
    key: ["profile", "scout"],
    url: `/profiles/scout/${loggedInData?.profileRefs["scout"]}`,
    enabled: !!loggedInData?.profileRefs["scout"],
  }) as any; // Type assertion since the hook returns different types based on method

  const selectedProfile = scoutProfileQuery.data;
  const profileIsLoading = scoutProfileQuery.isLoading;

  // Set up socket connection
  const { socket, isConnecting, setSocket, setIsConnecting } = useSocketStore((state: any) => state);

  // Socket connection setup
  useEffect(() => {
    if (process.env.API_URL) {
      setIsConnecting(true);
      const socket = io(
        process.env.NODE_ENV === "development" ? "http://localhost:5000" : process.env.API_URL.replace("/api/v1", "")
      );

      socket.on("connect", () => {
        setIsConnecting(false);
        setSocket(socket);
      });

      return () => {
        socket.disconnect();
      };
    }
  }, [setSocket, setIsConnecting]);

  // Socket event setup
  useEffect(() => {
    // If there is a user and a socket connection, setup a setup event with the user data
    if (socket && !isConnecting && loggedInData) {
      // Listen for user updates
      socket.emit("setup", loggedInData);
      socket.on("updateUser", () => {
        queryClient.invalidateQueries(["user"] as any);
      });

      // Listen for scout-specific events
      socket.on("updateScoutProfile", () => {
        queryClient.invalidateQueries(["profile", "scout"] as any);
      });
    }

    return () => {
      if (socket) {
        socket.off("updateUser");
        socket.off("updateScoutProfile");
      }
    };
  }, [socket, isConnecting, loggedInData, queryClient]);

  // Profile authorization check
  useEffect(() => {
    // Don't check authorization while still loading
    if (userIsLoading || profileIsLoading) return;

    // If user is logged in but has no scout profile reference
    if (loggedInData && !loggedInData?.profileRefs?.["scout"]) {
      alert("You do not have a scout profile associated with your account. Please contact support for access.");
      logout(false);
      return;
    }

    // If we have a profile response, check for scout permissions
    if (selectedProfile !== undefined) {
      // If selectedProfile is null or doesn't have scout role, deny access
      if (!selectedProfile?.payload) {
        alert("You are not authorized to access the scout portal. Scout permissions required.");
        logout(false);
        return;
      }

      // Additional check for scout-specific permissions if needed
      if (!selectedProfile?.payload?.isActive) {
        alert("Your scout profile is not active. Please contact support for assistance.");
        logout(false);
        return;
      }
    }
  }, [loggedInData, selectedProfile, userIsLoading, profileIsLoading]);

  // Show loading state while checking authorization
  if (userIsLoading || profileIsLoading) {
    return (
      <div
        style={{
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          minHeight: "100vh",
          background: "var(--bg-gradient)",
          color: "white",
        }}
      >
        <div style={{ textAlign: "center" }}>
          <div style={{ fontSize: "2rem", marginBottom: "1rem" }}>🏈</div>
          <div>Verifying scout credentials...</div>
        </div>
      </div>
    );
  }

  return <>{props.children}</>;
};

export default ScoutWrapper;
