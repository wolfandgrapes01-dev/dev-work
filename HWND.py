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