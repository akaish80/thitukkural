Add-Type -AssemblyName System.Drawing

function U([int[]]$codes) { ($codes | ForEach-Object { [char]::ConvertFromUtf32($_) }) -join "" }

$outputDir = "C:\Users\Mithun-Bhavi\Documents\Arun\thirukkural_vite\public\learning-images\png"
$W  = 220
$H  = 260
$IW = 200   # inner width (W - 20)
$BW = 212   # border inner width (W - 8)
$BH = 252   # border inner height (H - 8)

# All 18 mei ezhuthukal (consonants) with reference words from the Mei Ezhuthukkal chart
$consonants = @(
    @{ file="consonant-ka";   emojiCode=0x1F9A9; tamilWord=(U 0x0B95,0x0BCA,0x0B95,0x0BCD,0x0B95,0x0BC1);                             englishWord="Kokku (Stork)" }
    @{ file="consonant-nga";  emojiCode=0x1F981; tamilWord=(U 0x0B9A,0x0BBF,0x0B99,0x0BCD,0x0B95,0x0BAE,0x0BCD);                     englishWord="Singam (Lion)" }
    @{ file="consonant-sa";   emojiCode=0x1F33F; tamilWord=(U 0x0BAA,0x0B9A,0x0BCD,0x0B9A,0x0BC8);                                   englishWord="Pacchai (Green)" }
    @{ file="consonant-gna";  emojiCode=0x1F331; tamilWord=(U 0x0B87,0x0B9E,0x0BCD,0x0B9A,0x0BBF);                                   englishWord="Inchi (Ginger)" }
    @{ file="consonant-ta";   emojiCode=0x1FA81; tamilWord=(U 0x0BAA,0x0B9F,0x0BCD,0x0B9F,0x0BAE,0x0BCD);                            englishWord="Pattam (Kite)" }
    @{ file="consonant-nna";  emojiCode=0x1F980; tamilWord=(U 0x0BA8,0x0BA3,0x0BCD,0x0B9F,0x0BC1);                                   englishWord="Nandu (Crab)" }
    @{ file="consonant-tha";  emojiCode=0x1F40C; tamilWord=(U 0x0BA8,0x0BA4,0x0BCD,0x0BA4,0x0BC8);                                   englishWord="Nattai (Snail)" }
    @{ file="consonant-na";   emojiCode=0x1F989; tamilWord=(U 0x0B86,0x0BA8,0x0BCD,0x0BA4,0x0BC8);                                   englishWord="Aantai (Owl)" }
    @{ file="consonant-pa";   emojiCode=0x1F6A2; tamilWord=(U 0x0B95,0x0BAA,0x0BCD,0x0BAA,0x0BB2,0x0BCD);                            englishWord="Kappal (Ship)" }
    @{ file="consonant-ma";   emojiCode=0x1F333; tamilWord=(U 0x0BAE,0x0BB0,0x0BAE,0x0BCD);                                          englishWord="Maram (Tree)" }
    @{ file="consonant-ya";   emojiCode=0x1F415; tamilWord=(U 0x0BA8,0x0BBE,0x0BAF,0x0BCD);                                          englishWord="Naay (Dog)" }
    @{ file="consonant-ra";   emojiCode=0x1F332; tamilWord=(U 0x0BB5,0x0BC7,0x0BB0,0x0BCD);                                          englishWord="Ver (Root)" }
    @{ file="consonant-la";   emojiCode=0x1F95B; tamilWord=(U 0x0BAA,0x0BBE,0x0BB2,0x0BCD);                                          englishWord="Paal (Milk)" }
    @{ file="consonant-va";   emojiCode=0x1F534; tamilWord=(U 0x0B9A,0x0BC6,0x0BB5,0x0BCD,0x0BB5,0x0BBE,0x0BAF,0x0BCD);             englishWord="Cevvaay (Mars)" }
    @{ file="consonant-zha";  emojiCode=0x1F3B5; tamilWord=(U 0x0BAF,0x0BBE,0x0BB4,0x0BCD);                                          englishWord="Yaal (Veena)" }
    @{ file="consonant-lla";  emojiCode=0x1F5E1; tamilWord=(U 0x0BB5,0x0BBE,0x0BB3,0x0BCD);                                          englishWord="Vaal (Sword)" }
    @{ file="consonant-rra";  emojiCode=0x1F9B7; tamilWord=(U 0x0BAA,0x0BB1,0x0BCD,0x0B95,0x0BB3,0x0BCD);                            englishWord="Patkal (Teeth)" }
    @{ file="consonant-nna2"; emojiCode=0x1F41F; tamilWord=(U 0x0BAE,0x0BC0,0x0BA9,0x0BCD);                                          englishWord="Miin (Fish)" }
)

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment     = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

foreach ($c in $consonants) {
    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::White)

    # border
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(226,232,240), 2)
    $g.DrawRectangle($pen, 4, 4, $BW, $BH)

    # emoji — large, centred in top 155px
    $emoji      = [char]::ConvertFromUtf32($c.emojiCode)
    $emojiFont  = New-Object System.Drawing.Font("Segoe UI Emoji", 80, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $blackBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15,23,42))
    $emojiRect  = [System.Drawing.RectangleF]::new(10, 10, $IW, 155)
    $g.DrawString($emoji, $emojiFont, $blackBrush, $emojiRect, $sf)

    # Tamil word
    $tamilFont = New-Object System.Drawing.Font("Latha", 20, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $tamilRect = [System.Drawing.RectangleF]::new(10, 172, $IW, 40)
    $g.DrawString($c.tamilWord, $tamilFont, $blackBrush, $tamilRect, $sf)

    # English label
    $engFont   = New-Object System.Drawing.Font("Arial", 15, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $greyBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100,116,139))
    $engRect   = [System.Drawing.RectangleF]::new(10, 215, $IW, 32)
    $g.DrawString($c.englishWord, $engFont, $greyBrush, $engRect, $sf)

    $outPath = Join-Path $outputDir "$($c.file).png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose(); $bmp.Dispose()
    $emojiFont.Dispose(); $tamilFont.Dispose(); $engFont.Dispose()
    $blackBrush.Dispose(); $greyBrush.Dispose(); $pen.Dispose()
    Write-Host "Generated: $($c.file).png"
}
Write-Host "All done."
