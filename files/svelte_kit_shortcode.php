<?php

function shortcodeHead() {
    return file_get_contents(plugin_dir_path( __FILE__ ) . "svelte_kit_shortcode_head.html");
}

function shortcodeBody() {
    return file_get_contents(plugin_dir_path( __FILE__ ) . "svelte_kit_shortcode_body.html");
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
    if (%shortcode.shadow%) return;

    global $post;
    if (!has_shortcode($post->post_content, "%shortcode.code%")) return;

    echo shortcodeHead();
}
add_action("wp_head", "svelte_kit_shortcode_head");

?>
