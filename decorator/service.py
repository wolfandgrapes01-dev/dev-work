from flask import jsonify

@app.post("/api/test")
@wait_socket(timeout=5)
def test(fut):
    key = "abc123"
    send_socket(key)

    try:
        # ⚠️ 不再返回 key
        # 现在直接等待结果
        result = fut.result()     # 但实际上装饰器已经帮你等了

        return jsonify({
            "success": True,
            "data": result
        }), 200

    except TimeoutError:
        return jsonify({
            "success": False,
            "reason": "socket timeout"
        }), 504