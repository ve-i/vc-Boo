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

const ChannelWrapperStyles = findByPropsLazy("muted", "wrapper");

export default function Boo({channel}: BooProps) {

    const { id } = channel;

    // Get the current user's ID
    const currentUserId = useStateFromStores([UserStore], () => UserStore.getCurrentUser()?.id);

    // Fetch the last message
    const lastMessage: Message = useStateFromStores([MessageStore], () => MessageStore.getMessages(id)?.last());

    // State to track if the last message was from the current user and if it contains a question mark
    const [isCurrentUser, setIsCurrentUser] = useState<boolean | null>(null);
    const [containsQuestionMark, setContainsQuestionMark] = useState<boolean>(false);
    const [isDataProcessed, setIsDataProcessed] = useState(false);

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
        setIsDataProcessed(true);
    }, [lastMessage, currentUserId]);
    if (!isDataProcessed || !currentUserId || !lastMessage) return null;

    return (
        !isCurrentUser && (
            <div className={ChannelWrapperStyles.wrapper}>
                {containsQuestionMark ? <IconGhostOrange /> : <IconGhost />}
            </div>
        )
    );
}
