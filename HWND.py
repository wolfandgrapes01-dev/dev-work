// MyWnd.cpp
#include "MyWnd.h"

BEGIN_MESSAGE_MAP(CMsgDlg, CDialog)
    ON_MESSAGE(WM_RESPONSE, &CMsgDlg::OnResponse)
END_MESSAGE_MAP()

LRESULT CMsgDlg::OnResponse(WPARAM wParam, LPARAM lParam) {
    int val = static_cast<int>(wParam);
    if (pyCallback) pyCallback(val);  // 调用 Python 回调
    return 0;
}



import mfc_msg

def callback(val):
    print("Received response:", val)

dlg = mfc_msg.MsgDlg()
dlg.register_callback(callback)

# 在 C++ 端通过 PostMessage 或 SendMessage 触发 WM_RESPONSE
# Python 会在 OnResponse 被调用时收到回调