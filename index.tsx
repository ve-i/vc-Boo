/*
 * Vencord, a Discord client mod
 * Copyright (c) 2024 Vendicated and contributors
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

import ErrorBoundary from "@components/ErrorBoundary";
import definePlugin from "@utils/types";

import Boo from "./components/Boo";
import { BooProps } from "./types";

export default definePlugin({
    name: "Boo",
    description: "A cute ghost will appear if you don't answer their DMs",
    authors: [{ name: "Vei", id: 239414094799699968n }],
    patches: [
        {
            // DMs
            find: /let{className:[^],focusProps:[^],...[^]}=[^];return\(/,
            replacement: {
                match: /(?<=\.\.\.([^])[^]*)}=[^];/,
                replace: `$&
                    if ($1.children?.props?.children?.[0]?.props?.children?.props)
                        $1.children.props.children[0].props.children.props.subText = [
                            $1.children.props.children.splice(0, 0, $self.renderBoo({ channel_url: $1.children.props.children[0].props.to }))
                        ];
                `.replace(/\s+/g, "")
            }
        },
    ],
    renderBoo: (props: BooProps) => {
        return (
            <ErrorBoundary noop>
                <Boo {...props} />
            </ErrorBoundary>
        );
    }
});
