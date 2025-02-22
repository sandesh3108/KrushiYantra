import requests
import json
from prediction import predict_image, get_sol
from flask import Flask, request, jsonify
import os

api_key = os.getenv("API_KEY")
API_URL = os.getenv("API_URI")

api_url = f"{API_URL}?key={api_key}"

app = Flask(__name__)

UPLOAD_FOLDER = r'../../uploads'
app.config['UPLOAD_FOLDER'] = UPLOAD_FOLDER
if not os.path.exists(UPLOAD_FOLDER):
    os.makedirs(UPLOAD_FOLDER)

def get_api_response(prompt):
    headers = {"Content-Type": "application/json"}
    payload = {"contents": [{"parts": [{"text": prompt}]}]}
    response = requests.post(api_url, headers=headers, json=payload)

    if response.status_code == 200:
        data = response.json()
        return data.get('candidates', [{}])[0].get('content', {}).get('parts', [{}])[0].get('text', 'No response text found')
    else:
        return f"Error: {response.status_code} - {response.text}"

# print(get_api_response("What type of fertilizer is best for growing wheat?")); #working properly no issue detected


def bot_interaction(farmer_input, img_path):
    disease_detection = None
    if img_path:
        disease_detection = predict_image(img_path)

    if isinstance(farmer_input, str):
        farmer_input = {"question": farmer_input}

    question = farmer_input.get("question", "")

    response = ""
    if disease_detection:
        response += f"Based on the image you uploaded, {get_sol(disease_detection[0])}"


    if question:
        prompt = f"Farmer asks: {question} \nBot answers:"
        response += get_api_response(prompt)

    return response

@app.route('/submit', methods=['POST'])
def submit():
    try:
        crop_type = request.form.get('crop_type')
        question = request.form.get('question')
        image = request.files.get('image')

        if not crop_type or not question or not image:
            return jsonify({"error": "All fields are required: crop_type, question, and image"}), 400

        image_path = os.path.join(app.config['UPLOAD_FOLDER'], image.filename)
        # print(image_path)
        image.save(image_path)

        result = bot_interaction(crop_type, image_path)

        api_response = get_api_response(question)
        

        return jsonify({"response": result, "answer":api_response }), 200

    except Exception as e:
        return jsonify({"error": str(e)}), 500
    

if __name__ == "__main__":
    app.run(debug=True, host="0.0.0.0", port=6969, use_reloader=True)