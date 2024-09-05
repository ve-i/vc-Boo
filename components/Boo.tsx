/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

// components/MessagePeek.tsx

import "./styles.css";

import { findByPropsLazy } from "@webpack";
import { MessageStore, UserStore, useStateFromStores } from "@webpack/common";
import { Message } from "discord-types/general";
import React from "react";

import { BooProps } from "../types";
import IconGhost from "./IconGhost"; // Adjust the path if necessary

const ChannelWrapperStyles = findByPropsLazy("muted", "subText");

export default function Boo(props: BooProps) {
    const { channel, channel_url } = props;
    if (!channel && !channel_url) return null;

    const channelId = channel ? channel.id : channel_url.split("/").pop() as string;

    // Fetch the last message
    const lastMessage: Message = useStateFromStores([MessageStore], () => MessageStore.getMessages(channelId)?.last());
    if (!lastMessage) return null;

    // Get the current user's ID
    const currentUserId = useStateFromStores([UserStore], () => UserStore.getCurrentUser()?.id);
    if (!currentUserId) return null;

    // Check if the last message is from the current user
    const isCurrentUser = lastMessage.author.id === currentUserId;

    return (
        <div
            className={ChannelWrapperStyles.subText}
            style={{ display: "flex", alignItems: "center", justifyContent: "center" }}
        >
            {/* Conditionally render the IconGhost */}
            {!isCurrentUser && (
                <IconGhost />
            )}
        </div>
    );
}
