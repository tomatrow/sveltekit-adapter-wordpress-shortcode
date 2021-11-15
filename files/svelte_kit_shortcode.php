<?php

function svelte_kit_shortcode($shortcode) {
    add_shortcode($shortcode, function ($attributes, $content, $shortcode) {
        $data = json_encode([
            'attributes' => $attributes,
            'content' => $content,
            'shortcode' => $shortcode
        ]);
    
        $id = $attributes["id"] ? $attributes["id"] : $shortcode;
    
        return <<<HTML
            %shortcode.body%
            <script>
                (window.__kitShortcodeData ??= []).push({$data})
            </script>
        HTML;
    });
    
    add_action("wp_head", function () use ($shortcode) {
        global $post;
        if (!has_shortcode($post->post_content, $shortcode)) return;
        
        ?>
            %shortcode.head%
        <?php
    }, 10, 3);
}

?>