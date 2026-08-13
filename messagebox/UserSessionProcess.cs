using System;
using System.ComponentModel;
using System.Runtime.InteropServices;

public static class UserSessionProcess
{
    // 获取当前 Console 用户的 Session ID
    [DllImport("kernel32.dll")]
    private static extern uint WTSGetActiveConsoleSessionId();


    // 根据 Session ID 获取该用户的 Token
    [DllImport("wtsapi32.dll", SetLastError = true)]
    private static extern bool WTSQueryUserToken(
        uint SessionId,
        out IntPtr phToken);


    // 使用用户 Token 创建进程
    [DllImport("advapi32.dll", SetLastError = true)]
    private static extern bool CreateProcessAsUser(
        IntPtr hToken,
        string lpApplicationName,
        string lpCommandLine,
        IntPtr lpProcessAttributes,
        IntPtr lpThreadAttributes,
        bool bInheritHandles,
        uint dwCreationFlags,
        IntPtr lpEnvironment,
        string lpCurrentDirectory,
        ref STARTUPINFO lpStartupInfo,
        out PROCESS_INFORMATION lpProcessInformation);


    [DllImport("userenv.dll", SetLastError = true)]
    private static extern bool CreateEnvironmentBlock(
        out IntPtr lpEnvironment,
        IntPtr hToken,
        bool bInherit);


    [DllImport("userenv.dll", SetLastError = true)]
    private static extern bool DestroyEnvironmentBlock(
        IntPtr lpEnvironment);


    [DllImport("kernel32.dll", SetLastError = true)]
    private static extern bool CloseHandle(
        IntPtr hObject);


    private const uint CREATE_UNICODE_ENVIRONMENT = 0x00000400;


    [StructLayout(LayoutKind.Sequential)]
    private struct STARTUPINFO
    {
        public int cb;
        public string lpReserved;
        public string lpDesktop;
        public string lpTitle;
        public int dwX;
        public int dwY;
        public int dwXSize;
        public int dwYSize;
        public int dwXCountChars;
        public int dwYCountChars;
        public int dwFillAttribute;
        public int dwFlags;
        public short wShowWindow;
        public short cbReserved2;
        public IntPtr lpReserved2;
        public IntPtr hStdInput;
        public IntPtr hStdOutput;
        public IntPtr hStdError;
    }


    [StructLayout(LayoutKind.Sequential)]
    private struct PROCESS_INFORMATION
    {
        public IntPtr hProcess;
        public IntPtr hThread;
        public int dwProcessId;
        public int dwThreadId;
    }


    public static void ShowMessage(string message)
    {
        uint sessionId = WTSGetActiveConsoleSessionId();

        if (sessionId == 0xFFFFFFFF)
        {
            throw new InvalidOperationException(
                "No active console session.");
        }

        IntPtr userToken = IntPtr.Zero;
        IntPtr environment = IntPtr.Zero;

        try
        {
            // ==========================================
            // 1. 根据 Session ID 获取用户 Token
            // ==========================================

            if (!WTSQueryUserToken(
                    sessionId,
                    out userToken))
            {
                throw new Win32Exception(
                    Marshal.GetLastWin32Error(),
                    "WTSQueryUserToken failed.");
            }


            // ==========================================
            // 2. 创建用户环境变量
            // ==========================================

            if (!CreateEnvironmentBlock(
                    out environment,
                    userToken,
                    false))
            {
                throw new Win32Exception(
                    Marshal.GetLastWin32Error(),
                    "CreateEnvironmentBlock failed.");
            }


            // ==========================================
            // 3. 设置启动信息
            // ==========================================

            var startupInfo = new STARTUPINFO
            {
                cb = Marshal.SizeOf<STARTUPINFO>(),

                // 非常重要
                lpDesktop = @"winsta0\default"
            };


            // ==========================================
            // 4. MessageBox.exe
            // ==========================================

            string exePath =
                @"C:\MyService\MessageBox.exe";

            string commandLine =
                $"\"{exePath}\" \"{message}\"";


            // ==========================================
            // 5. 在指定 Session 创建进程
            // ==========================================

            if (!CreateProcessAsUser(
                    userToken,
                    exePath,
                    commandLine,
                    IntPtr.Zero,
                    IntPtr.Zero,
                    false,
                    CREATE_UNICODE_ENVIRONMENT,
                    environment,
                    System.IO.Path.GetDirectoryName(exePath),
                    ref startupInfo,
                    out PROCESS_INFORMATION processInfo))
            {
                throw new Win32Exception(
                    Marshal.GetLastWin32Error(),
                    "CreateProcessAsUser failed.");
            }


            // ==========================================
            // 6. 关闭 Handle
            // ==========================================

            CloseHandle(processInfo.hThread);
            CloseHandle(processInfo.hProcess);
        }
        finally
        {
            if (environment != IntPtr.Zero)
            {
                DestroyEnvironmentBlock(environment);
            }

            if (userToken != IntPtr.Zero)
            {
                CloseHandle(userToken);
            }
        }
    }
}