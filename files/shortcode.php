add_shortcode($shortcode, function ($attributes, $content, $shortcode) {
$svelteKit = <<<HTML
	%svelte.head%
    %svelte.body%
HTML;
    
    $data = json_encode(array('attributes' => $attributes, "shortcode" => $shortcode));

$info = <<<HTML
    <script id="{$shortcode}-data" type="application/json">
        {$data}
    </script>
    <script id="{$shortcode}-content" type="text/html">
        {$content}
    </script>
HTML;

    $safeClose = "</__script>";
    $mangled = str_replace('</script>', $safeClose, $svelteKit . $info);

$html = <<<HTML
    <script id="{$shortcode}-svelte-kit" type="text/plain">
        {$mangled}
    </script>
    <div id="{$shortcode}-container"></div>
    <script>
        ;(() => {
            const svelteKitHtml = document.querySelector("#{$shortcode}-svelte-kit")
            const target = document.querySelector("#{$shortcode}-container")
            const shadow = target.attachShadow({ mode: "open" })
            shadow.innerHTML = svelteKitHtml.innerText.replaceAll("{$safeClose}", "</" + "script>")
        })()
    </script>
HTML;

    return $html;
});
