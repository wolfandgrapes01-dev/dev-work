Add-Type -AssemblyName PresentationFramework


$server = "localhost"
$database = "你的数据库名"


$query = @"
SELECT TOP 1
    Drive,
    FreeGB
FROM dbo.DiskInfo
WHERE NeedAlert = 1
AND AlertSent = 0
"@


$result = Invoke-Sqlcmd `
    -ServerInstance $server `
    -Database $database `
    -Query $query



if ($null -ne $result)
{

    $message =
    "Disk Warning`n" +
    "Drive: " + $result.Drive + "`n" +
    "Free Space: " + $result.FreeGB + " GB"


    [System.Windows.MessageBox]::Show(
        $message,
        "Disk Warning"
    )


    $update = @"
UPDATE dbo.DiskInfo
SET AlertSent = 1
WHERE Drive = '$($result.Drive)'
"@


    Invoke-Sqlcmd `
        -ServerInstance $server `
        -Database $database `
        -Query $update

}