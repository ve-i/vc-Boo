/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { findByPropsLazy } from "@webpack";
import { React, useEffect, useState, MessageStore, UserStore, useStateFromStores } from "@webpack/common";
import { Message } from "discord-types/general";

import { BooProps } from "../types";
import IconGhost from "./IconGhost"; // Adjust the path if necessary
import IconGhostOrange from "./IconGhost-Orange"; // For the orange icon

const ChannelWrapperStyles = findByPropsLazy("muted", "subText");

export default function Boo(props: BooProps) {
    const { channel, channel_url } = props;
    if (!channel && !channel_url) return null;

    const channelId = channel ? channel.id : channel_url.split("/").pop() as string;

    // Get the current user's ID
    const currentUserId = useStateFromStores([UserStore], () => UserStore.getCurrentUser()?.id);
    if (!currentUserId) return null;

    // Fetch the last message
    const lastMessage: Message = useStateFromStores([MessageStore], () => MessageStore.getMessages(channelId)?.last());
    if (!lastMessage) return null;

    // State to track if the last message was from the current user and if it contains a question mark
    const [isCurrentUser, setIsCurrentUser] = useState<boolean>(false);
    const [containsQuestionMark, setContainsQuestionMark] = useState<boolean>(false);

    // Update state based on message content
    useEffect(() => {
        if (!lastMessage || !currentUserId) return;

        const lastIsCurrentUser = lastMessage.author.id === currentUserId;
        setIsCurrentUser(lastIsCurrentUser);

        if (!lastIsCurrentUser) {
            setContainsQuestionMark(lastMessage.content.includes("?"));
        } else {
            setContainsQuestionMark(false); // Reset if the last message is from the current user
        }
    }, [lastMessage, currentUserId]);

    return (
        <div
            className={ChannelWrapperStyles.subText}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            {/* Conditionally render the ghost icon based on the message */}
            {!isCurrentUser && (
                <>
                    {containsQuestionMark ? (
                        <IconGhostOrange /> // Use the orange ghost if there's a question mark
                    ) : (
                        <IconGhost /> // Default ghost icon if no question mark
                    )}
                </>
            )}
        </div>
    );
}
