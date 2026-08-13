using System;
using System.Runtime.InteropServices;

public static class SessionMessage
{
    [DllImport(
        "wtsapi32.dll",
        SetLastError = true,
        CharSet = CharSet.Unicode)]
    private static extern bool WTSSendMessage(
        IntPtr hServer,
        uint SessionId,
        string pTitle,
        uint TitleLength,
        string pMessage,
        uint MessageLength,
        uint Style,
        uint Timeout,
        out uint pResponse,
        bool bWait);

    public static bool Show(
        uint sessionId,
        string title,
        string message)
    {
        uint response;

        return WTSSendMessage(
            IntPtr.Zero,
            sessionId,
            title,
            (uint)(title.Length * 2),
            message,
            (uint)(message.Length * 2),
            0x00000030, // MB_ICONWARNING
            0,           // 不自动关闭
            out response,
            true);
    }
}