/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import "./styles.css";

import { findByPropsLazy } from "@webpack";
import { MessageStore, React, useEffect, UserStore, useState, useStateFromStores } from "@webpack/common";
import { Message } from "discord-types/general";

import { BooProps } from "../types";
import IconGhost from "./IconGhost";
import IconGhostOrange from "./IconGhost-Orange";

const ChannelWrapperStyles = findByPropsLazy("muted", "subText");

export default function Boo({channel}: BooProps) {

    const { id } = channel;

    // Get the current user's ID
    const currentUserId = useStateFromStores([UserStore], () => UserStore.getCurrentUser()?.id);

    // Fetch the last message
    const lastMessage: Message = useStateFromStores([MessageStore], () => MessageStore.getMessages(id)?.last());

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
    if (!currentUserId || !lastMessage) return null;

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
