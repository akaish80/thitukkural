Add-Type -AssemblyName System.Drawing

function U([int[]]$codes) { ($codes | ForEach-Object { [char]::ConvertFromUtf32($_) }) -join "" }

$outputDir = "C:\Users\Mithun-Bhavi\Documents\Arun\thirukkural_vite\public\learning-images\png"
$W  = 220
$H  = 260
$IW = 200   # inner width (W - 20)
$BW = 212   # border inner width (W - 8)
$BH = 252   # border inner height (H - 8)

$vowels = @(
    @{ file="vowel-a";  emojiCode=0x1F469; tamilWord=(U 0x0B85,0x0BAE,0x0BCD,0x0BAE,0x0BBE);                                                                          englishWord="Amma" }
    @{ file="vowel-aa"; emojiCode=0x1F410; tamilWord=(U 0x0B86,0x0B9F,0x0BC1);                                                                                         englishWord="Aadu" }
    @{ file="vowel-i";  emojiCode=0x1F343; tamilWord=(U 0x0B87,0x0BB2,0x0BC8);                                                                                         englishWord="Ilai" }
    @{ file="vowel-ii"; emojiCode=0x1FAB0; tamilWord=(U 0x0B88);                                                                                                       englishWord="Ee (Fly)" }
    @{ file="vowel-u";  emojiCode=0x1F372; tamilWord=(U 0x0B89,0x0BA3,0x0BB5,0x0BC1);                                                                                 englishWord="Unavu" }
    @{ file="vowel-uu"; emojiCode=0x1F3A0; tamilWord=(U 0x0B8A,0x0B9E,0x0BCD,0x0B9A,0x0BB2,0x0BCD);                                                                  englishWord="Oonchal" }
    @{ file="vowel-e";  emojiCode=0x1F42D; tamilWord=(U 0x0B8E,0x0BB2,0x0BBF);                                                                                        englishWord="Eli" }
    @{ file="vowel-ee"; emojiCode=0x1FAA4; tamilWord=(U 0x0B8F,0x0BA3,0x0BBF);                                                                                        englishWord="Aeni" }
    @{ file="vowel-ai"; emojiCode=0x270B;  tamilWord=(U 0x0B90,0x0BA8,0x0BCD,0x0BA4,0x0BC1);                                                                          englishWord="Ainthu" }
    @{ file="vowel-o";  emojiCode=0x1F992; tamilWord=(U 0x0B92,0x0B9F,0x0BCD,0x0B9F,0x0B95,0x0B9A,0x0BCD,0x0B9A,0x0BBF,0x0BB5,0x0BBF,0x0B99,0x0BCD,0x0B95,0x0BBF); englishWord="Giraffe" }
    @{ file="vowel-oo"; emojiCode=0x26F5;  tamilWord=(U 0x0B93,0x0B9F,0x0BAE,0x0BCD);                                                                                 englishWord="Odam" }
    @{ file="vowel-au"; emojiCode=0x1F48A; tamilWord=(U 0x0B94,0x0B9F,0x0BA4,0x0BAE,0x0BCD);                                                                          englishWord="Audhadham" }
)

$sf = New-Object System.Drawing.StringFormat
$sf.Alignment     = [System.Drawing.StringAlignment]::Center
$sf.LineAlignment = [System.Drawing.StringAlignment]::Center

foreach ($v in $vowels) {
    $bmp = New-Object System.Drawing.Bitmap($W, $H)
    $g   = [System.Drawing.Graphics]::FromImage($bmp)
    $g.SmoothingMode     = [System.Drawing.Drawing2D.SmoothingMode]::AntiAlias
    $g.TextRenderingHint = [System.Drawing.Text.TextRenderingHint]::AntiAliasGridFit
    $g.Clear([System.Drawing.Color]::White)

    # border
    $pen = New-Object System.Drawing.Pen([System.Drawing.Color]::FromArgb(226,232,240), 2)
    $g.DrawRectangle($pen, 4, 4, $BW, $BH)

    # emoji — large, centred in top 155px
    $emoji      = [char]::ConvertFromUtf32($v.emojiCode)
    $emojiFont  = New-Object System.Drawing.Font("Segoe UI Emoji", 80, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $blackBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(15,23,42))
    $emojiRect  = [System.Drawing.RectangleF]::new(10, 10, $IW, 155)
    $g.DrawString($emoji, $emojiFont, $blackBrush, $emojiRect, $sf)

    # Tamil word
    $tamilFont = New-Object System.Drawing.Font("Latha", 20, [System.Drawing.FontStyle]::Bold, [System.Drawing.GraphicsUnit]::Pixel)
    $tamilRect = [System.Drawing.RectangleF]::new(10, 172, $IW, 40)
    $g.DrawString($v.tamilWord, $tamilFont, $blackBrush, $tamilRect, $sf)

    # English label
    $engFont   = New-Object System.Drawing.Font("Arial", 15, [System.Drawing.FontStyle]::Regular, [System.Drawing.GraphicsUnit]::Pixel)
    $greyBrush = New-Object System.Drawing.SolidBrush([System.Drawing.Color]::FromArgb(100,116,139))
    $engRect   = [System.Drawing.RectangleF]::new(10, 215, $IW, 32)
    $g.DrawString($v.englishWord, $engFont, $greyBrush, $engRect, $sf)

    $outPath = Join-Path $outputDir "$($v.file).png"
    $bmp.Save($outPath, [System.Drawing.Imaging.ImageFormat]::Png)

    $g.Dispose(); $bmp.Dispose()
    $emojiFont.Dispose(); $tamilFont.Dispose(); $engFont.Dispose()
    $blackBrush.Dispose(); $greyBrush.Dispose(); $pen.Dispose()
    Write-Host "Generated: $($v.file).png"
}
Write-Host "All done."
