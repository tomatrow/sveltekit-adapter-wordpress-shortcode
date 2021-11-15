<?php

function svelte_kit_shortcode_add($attributes, $content) {
    $data = json_encode($attributes);
    return <<<HTML
        <script id="%shortcode.code%-attributes" type="application/json">
            {$data}
        </script>
        <template id="%shortcode.code%-content">
            {$content}
        </template>
        %shortcode.body%
    HTML;
}
add_shortcode("%shortcode.code%", "svelte_kit_shortcode_add");


function svelte_kit_shortcode_head() {
    global $post;
    if (!has_shortcode($post->post_content, "%shortcode.code%")) return;
    
    ?>
        %shortcode.head%
    <?php
}
add_action("wp_head", "svelte_kit_shortcode_head");

?>