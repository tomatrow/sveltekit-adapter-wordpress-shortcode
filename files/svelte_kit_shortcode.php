<?php

function shortcodeHead() {
    return <<<HTML
        %shortcode.head%
    HTML;
}

function shortcodeBody() {
    return <<<HTML
        %shortcode.body%
    HTML;
}

function shortcodeData($attributes, $content) {
    $jsonAttributes = json_encode($attributes);
    return <<<HTML
        <script id="%shortcode.code%-attributes" type="application/json">
            {$jsonAttributes}
        </script>
        <template id="%shortcode.code%-content">
            {$content}
        </template>
    HTML;
}

function svelte_kit_shortcode_add($attributes, $content) {
    $injection = shortcodeData($attributes, $content) .  shortcodeBody();
    
    if (%shortcode.shadow%) {
        $injection .= shortcodeHead();
        return <<<HTML
            <template id="%shortcode.code%-template">
                {$injection}
            </template>
            <div id="%shortcode.code%-container"></div>
            <script>
                document
                    .querySelector("#%shortcode.code%-container")
                    .attachShadow({ mode: "open" })
                    .appendChild(document.querySelector("#%shortcode.code%-template").content)
            </script>
         HTML;
    } else {
        return $injection;
    }
}
add_shortcode("%shortcode.code%", "svelte_kit_shortcode_add");

function svelte_kit_shortcode_head() {
    global $post;
    if (!has_shortcode($post->post_content, "%shortcode.code%") || %shortcode.shadow%) return;
    echo shortcodeHead();
}
add_action("wp_head", "svelte_kit_shortcode_head");

?>
