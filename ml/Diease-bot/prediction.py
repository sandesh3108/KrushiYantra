import numpy as np
from keras.preprocessing import image
import cv2
import matplotlib.pyplot as plt
from tensorflow.keras.models import load_model

# Load the trained model
loaded_model = load_model("model_json.h5")

# List of class labels
class_labels = [
    "American Bollworm on Cotton", "Anthracnose on Cotton", "Apple___Apple_scab", "Apple___Black_rot", 
    "Apple___Cedar_apple_rust", "Apple___Healthy", "Army worm", "Becterial Blight in Rice", "Blueberry___healthy", 
    "Brownspot", "Cherry_(including_sour)___Powdery_mildew", "Cherry_(including_sour)___healthy", "Common_Rust", 
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot", "Corn_(maize)___Common_rust_", "Corn_(maize)___Healthy", 
    "Corn_(maize)___Northern_Leaf_Blight", "Cotton Aphid", "Flag Smut", "Grape___Black_rot", "Grape___Esca_(Black_Measles)", 
    "Grape___Healthy", "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)", "Gray_Leaf_Spot", "Healthy Maize", "Healthy Wheat", 
    "Healthy cotton", "Leaf Curl", "Leaf smut", "Mosaic sugarcane", "Orange___Haunglongbing_(Citrus_greening)", 
    "Peach___Bacterial_spot", "Peach___healthy", "Pepper,_bell___Bacterial_spot", "Pepper,_bell___healthy", 
    "Potato___Early_blight", "Potato___Healthy", "Potato___Late_blight", "Raspberry___healthy", "RedRot sugarcane", 
    "RedRust sugarcane", "Rice Blast", "Soybean___healthy", "Squash___Powdery_mildew", "Strawberry___Leaf_scorch", 
    "Strawberry___healthy", "Sugarcane Healthy", "Tomato___Bacterial_spot", "Tomato___Early_blight", "Tomato___Healthy", 
    "Tomato___Late_blight", "Tomato___Leaf_Mold", "Tomato___Septoria_leaf_spot", "Tomato___Spider_mites Two-spotted_spider_mite", 
    "Tomato___Target_Spot", "Tomato___Tomato_Yellow_Leaf_Curl_Virus", "Tomato___Tomato_mosaic_virus", "Tungro", 
    "Wheat Brown leaf Rust", "Wheat Stem fly", "Wheat aphid", "Wheat black rust", "Wheat leaf blight", "Wheat mite", 
    "Wheat powdery mildew", "Wheat scab", "Wheat___Yellow_Rust", "Wilt", "Yellow Rust Sugarcane", "bacterial_blight in Cotton", 
    "bollrot on Cotton", "bollworm on Cotton", "cotton mealy bug", "cotton whitefly", "maize ear rot", "maize fall armyworm", 
    "maize stem borer", "pink bollworm in cotton", "red cotton bug", "thirps on cotton"
]

solutions = {
    "American Bollworm on Cotton": {
        "Remedies": [
            "Use neem-based pesticides.",
            "Apply Bacillus thuringiensis (Bt) sprays.",
            "Use pheromone traps to monitor and control infestation."
        ],
        "Precautions": [
            "Avoid excessive nitrogen fertilization.",
            "Rotate crops to disrupt pest life cycles.",
            "Encourage natural predators like ladybugs."
        ]
    },
    "Anthracnose on Cotton": {
        "Remedies": [
            "Use fungicides like chlorothalonil.",
            "Remove and destroy infected plant debris.",
            "Apply copper-based sprays."
        ],
        "Precautions": [
            "Ensure proper crop spacing for air circulation.",
            "Avoid overhead watering.",
            "Rotate crops regularly."
        ]
    },
    "Apple___Apple_scab": {
        "Remedies": [
            "Apply fungicides such as captan or myclobutanil.",
            "Remove and destroy infected leaves.",
            "Plant resistant apple varieties."
        ],
        "Precautions": [
            "Prune trees to improve air circulation.",
            "Avoid overhead watering.",
            "Apply protective fungicide sprays before infection spreads."
        ]
    },
    "Apple___Black_rot": {
        "Remedies": [
            "Use fungicides like thiophanate-methyl.",
            "Remove infected fruit and twigs.",
            "Improve air circulation through pruning."
        ],
        "Precautions": [
            "Avoid excessive moisture around trees.",
            "Ensure proper fertilization and soil health.",
            "Monitor orchards regularly for early signs."
        ]
    },
    "Apple___Cedar_apple_rust": {
        "Remedies": [
            "Apply fungicides like myclobutanil.",
            "Remove nearby juniper trees to break the disease cycle.",
            "Use resistant apple varieties."
        ],
        "Precautions": [
            "Avoid planting apple trees near junipers.",
            "Monitor trees in early spring for symptoms.",
            "Ensure proper tree pruning and maintenance."
        ]
    },
    "Apple___Healthy": {
        "Remedies": [
            "Maintain proper watering and fertilization.",
            "Monitor trees for any disease symptoms.",
            "Use organic treatments to prevent infections."
        ],
        "Precautions": [
            "Ensure trees receive adequate sunlight.",
            "Regularly inspect for pests and diseases.",
            "Use mulch to maintain soil health."
        ]
    },
    "Army worm": {
        "Remedies": [
            "Apply biological pesticides like Bt.",
            "Use neem-based sprays.",
            "Encourage natural predators like birds and wasps."
        ],
        "Precautions": [
            "Monitor crops regularly for egg clusters.",
            "Avoid excessive use of nitrogen fertilizers.",
            "Use pheromone traps to detect early infestations."
        ]
    },
    "Becterial Blight in Rice": {
        "Remedies": [
            "Use copper-based bactericides.",
            "Apply antibiotics like streptomycin in severe cases.",
            "Use resistant rice varieties."
        ],
        "Precautions": [
            "Avoid overhead irrigation.",
            "Ensure proper spacing between plants.",
            "Use clean seeds and maintain field hygiene."
        ]
    },
    "Blueberry___healthy": {
        "Remedies": [
            "Ensure balanced nutrient supply.",
            "Monitor for any early signs of disease.",
            "Use organic mulching for moisture retention."
        ],
        "Precautions": [
            "Provide adequate sunlight.",
            "Maintain proper pruning for air circulation.",
            "Use disease-resistant blueberry varieties."
        ]
    },
    "Brownspot": {
        "Remedies": [
            "Apply fungicides like Mancozeb or Carbendazim.",
            "Use disease-resistant crop varieties.",
            "Maintain proper field sanitation to remove infected plant debris."
        ],
        "Precautions": [
            "Ensure proper crop rotation to break the disease cycle.",
            "Avoid excessive nitrogen fertilizer application.",
            "Promote good air circulation by maintaining proper plant spacing."
        ]
    },
    "Cabbage_Diseased": {
        "Remedies": [
            "Apply suitable fungicides or insecticides based on the identified disease.",
            "Use neem-based pesticides for organic control.",
            "Remove and destroy infected plants to prevent spread."
        ],
        "Precautions": [
            "Use disease-resistant cabbage varieties.",
            "Maintain proper soil drainage to prevent fungal infections.",
            "Practice crop rotation with non-cruciferous plants."
        ]
    },
    "Cabbage_Healthy": {
        "Remedies": ["No remedies required as the plant is healthy."],
        "Precautions": [
            "Continue regular monitoring for early signs of disease.",
            "Maintain proper irrigation and fertilization practices.",
            "Implement integrated pest management (IPM) strategies."
        ]
    },
    "Cherry_(including_sour)___Powdery_mildew": {
        "Remedies": [
            "Spray sulfur-based fungicides or potassium bicarbonate solutions.",
            "Prune affected branches to improve airflow.",
            "Apply neem oil as an organic alternative."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Ensure proper plant spacing for good air circulation.",
            "Regularly inspect plants and remove infected leaves."
        ]
    },
    "Cherry_(including_sour)___healthy": {
        "Remedies": ["No remedies required as the plant is healthy."],
        "Precautions": [
            "Maintain regular pruning and good hygiene practices.",
            "Monitor for early signs of diseases and pests.",
            "Ensure adequate fertilization and proper irrigation."
        ]
    },
    "Citrus_Black spot": {
        "Remedies": [
            "Apply copper-based fungicides regularly.",
            "Remove and destroy infected fruits and leaves.",
            "Ensure proper irrigation management to avoid excessive moisture."
        ],
        "Precautions": [
            "Use disease-free seedlings for planting.",
            "Maintain proper sanitation by removing fallen debris.",
            "Ensure adequate spacing between trees for airflow."
        ]
    },
    "Citrus_Canker": {
        "Remedies": [
            "Spray copper-based bactericides.",
            "Prune infected branches and destroy them.",
            "Use antibiotics like streptomycin for bacterial control."
        ],
        "Precautions": [
            "Plant disease-resistant citrus varieties.",
            "Avoid mechanical injuries to the plant, as they can allow bacteria entry.",
            "Disinfect pruning tools before and after use."
        ]
    },
    "Citrus_Greening": {
        "Remedies": [
            "Apply systemic insecticides to control psyllid populations.",
            "Remove and destroy infected trees to prevent spread.",
            "Use micronutrient sprays to improve tree health."
        ],
        "Precautions": [
            "Use certified disease-free seedlings for planting.",
            "Implement biological control using natural enemies of psyllids.",
            "Regularly monitor trees for symptoms of infection."
        ]
    },
    "Citrus_Healthy": {
        "Remedies": ["No remedies required as the plant is healthy."],
        "Precautions": [
            "Ensure proper fertilization and watering schedules.",
            "Regularly inspect trees for early signs of disease.",
            "Implement good cultural practices to maintain tree health."
        ]
    },
    "Citrus_Melanose": {
        "Remedies": [
            "Spray copper-based fungicides during early fruit development.",
            "Prune dead or diseased branches to reduce fungal spores.",
            "Improve air circulation within the canopy."
        ],
        "Precautions": [
            "Ensure proper irrigation to avoid water stress.",
            "Maintain field hygiene by removing fallen leaves and twigs.",
            "Use resistant citrus varieties where available."
        ]
    },
    "Common_Rust": {
        "Remedies": [
            "Apply sulfur-based fungicides or potassium bicarbonate solutions.",
            "Remove and destroy infected plants to prevent spread.",
            "Use neem oil as an organic alternative."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Ensure proper plant spacing for good air circulation.",
            "Regularly inspect plants and remove infected leaves."
        ]
    },
    "Corn_(maize)___Cercospora_leaf_spot Gray_leaf_spot": {
        "Remedies": [
            "Apply copper-based fungicides.",
            "Remove and destroy infected leaves to prevent spread.",
            "Use disease-resistant maize varieties."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Ensure proper plant spacing for good air circulation.",
            "Regularly inspect plants and remove infected leaves."
        ]
    },
    "Corn_(maize)___Common_rust_": {
        "Remedies": [
            "Spray sulfur-based fungicides or potassium bicarbonate solutions.",
            "Prune affected branches to improve airflow.",
            "Apply neem oil as an organic alternative."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Ensure proper plant spacing for good air circulation.",
            "Regularly inspect plants and remove infected leaves."
        ]
    },
    "Corn_(maize)___Healthy": {
        "Remedies": ["No remedies required as the plant is healthy."],
        "Precautions": [
            "Maintain regular pruning and good hygiene practices.",
            "Monitor for early signs of diseases and pests.",
            "Ensure adequate fertilization and proper irrigation."
        ]
    },
    "Corn_(maize)___Northern_Leaf_Blight": {
        "Remedies": [
            "Apply copper-based fungicides.",
            "Remove and destroy infected leaves to prevent spread.",
            "Use disease-resistant maize varieties."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Ensure proper plant spacing for good air circulation.",
            "Regularly inspect plants and remove infected leaves."
        ]
    },
    "Cucumber_Anthracnose": {
        "Remedies": [
            "Apply copper-based fungicides.",
            "Remove and destroy infected leaves to prevent spread.",
            "Use disease-resistant cucumber varieties."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Ensure proper plant spacing for good air circulation.",
            "Regularly inspect plants and remove infected leaves."
        ]
    },
    "Cucumber_Bacterial Wilt": {
        "Remedies": [
            "Apply copper-based fungicides.",
            "Remove and destroy infected leaves to prevent spread.",
            "Use disease-resistant cucumber varieties."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Ensure proper plant spacing for good air circulation.",
            "Regularly inspect plants and remove infected leaves."
        ]
    },
    "Cucumber_Belly Rot": {
        "Remedies": [
            "Apply copper-based fungicides.",
            "Remove and destroy infected leaves to prevent spread.",
            "Use disease-resistant cucumber varieties."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Ensure proper plant spacing for good air circulation.",
            "Regularly inspect plants and remove infected leaves."
        ]
    },
    "Cucumber_Downy Mildew": {
        "Remedies": [
            "Apply copper-based fungicides.",
            "Remove and destroy infected leaves to prevent spread.",
            "Use disease-resistant cucumber varieties."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Ensure proper plant spacing for good air circulation.",
            "Regularly inspect plants and remove infected leaves."
        ]
    },
    "Cucumber_Fresh Cucumber": {
        "Remedies": [
            "Apply copper-based fungicides.",
            "Remove and destroy infected leaves to prevent spread.",
            "Use disease-resistant cucumber varieties."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Ensure proper plant spacing for good air circulation.",
            "Regularly inspect plants and remove infected leaves."
        ]
    },
    "Cucumber_Fresh Leaf_Healthy": {
        "Remedies": ["No remedies required as the plant is healthy."],
        "Precautions": [
            "Maintain regular pruning and good hygiene practices.",
            "Monitor for early signs of diseases and pests.",
            "Ensure adequate fertilization and proper irrigation."
        ]
    },
    "Cucumber_Gummy Stem Blight": {
        "Remedies": [
            "Apply copper-based fungicides.",
            "Remove and destroy infected leaves to prevent spread.",
            "Use disease-resistant cucumber varieties."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Ensure proper plant spacing for good air circulation.",
            "Regularly inspect plants and remove infected leaves."
        ]
    },
    "Cucumber_Pythium Fruit Rot": {
        "Remedies": [
            "Apply copper-based fungicides.",
            "Remove and destroy infected leaves to prevent spread.",
            "Use disease-resistant cucumber varieties."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Ensure proper plant spacing for good air circulation.",
            "Regularly inspect plants and remove infected leaves."
        ]
    },
    "Cotton Aphid": {
        "Remedies": [
            "Use neem oil or insecticidal soaps to control aphids.",
            "Encourage natural predators like ladybugs and lacewings.",
            "Apply systemic insecticides if infestation is severe."
        ],
        "Precautions": [
            "Regularly monitor plants for early signs of aphid infestation.",
            "Avoid over-fertilizing, as it promotes aphid population growth.",
            "Use reflective mulches to repel aphids."
        ]
    },
    "Flag Smut": {
        "Remedies": [
            "Use resistant wheat varieties to prevent infection.",
            "Apply fungicide-treated seeds before sowing.",
            "Rotate crops to break the disease cycle."
        ],
        "Precautions": [
            "Avoid planting wheat in infected soil for at least three years.",
            "Use certified disease-free seeds.",
            "Ensure proper field sanitation by removing infected crop residues."
        ]
    },
    "Grape___Black_rot": {
        "Remedies": [
            "Apply fungicides like myclobutanil or mancozeb at the first sign of infection.",
            "Prune and remove infected leaves and vines.",
            "Improve air circulation by spacing vines properly."
        ],
        "Precautions": [
            "Avoid overhead watering to reduce moisture on leaves.",
            "Use disease-resistant grape varieties.",
            "Maintain proper weed control to prevent disease spread."
        ]
    },
    "Grape___Esca_(Black_Measles)": {
        "Remedies": [
            "Remove and destroy infected vines to prevent spread.",
            "Improve soil drainage and avoid excessive irrigation.",
            "Use fungicides with pyraclostrobin or tebuconazole."
        ],
        "Precautions": [
            "Ensure proper pruning techniques to reduce wounds.",
            "Avoid excessive nitrogen fertilization.",
            "Maintain vineyard cleanliness to reduce fungal spores."
        ]
    },
    "Grape___Healthy": {
        "Remedies": [
            "Regular application of organic compost for better growth.",
            "Monitor for pests and diseases regularly.",
            "Ensure adequate watering and nutrient supply."
        ],
        "Precautions": [
            "Use disease-resistant varieties.",
            "Maintain proper spacing between plants.",
            "Implement proper trellising for support and air circulation."
        ]
    },
    "Grape___Leaf_blight_(Isariopsis_Leaf_Spot)": {
        "Remedies": [
            "Apply copper-based fungicides to control the infection.",
            "Remove and destroy infected leaves.",
            "Improve airflow around plants to reduce humidity."
        ],
        "Precautions": [
            "Avoid overwatering, as moisture promotes fungal growth.",
            "Sanitize pruning tools to prevent disease spread.",
            "Use resistant grape varieties when possible."
        ]
    },
    "Gray_Leaf_Spot": {
        "Remedies": [
            "Apply fungicides containing azoxystrobin or pyraclostrobin.",
            "Plant disease-resistant corn varieties.",
            "Practice crop rotation with non-host crops."
        ],
        "Precautions": [
            "Avoid dense planting to allow better airflow.",
            "Remove infected crop residues post-harvest.",
            "Use balanced fertilizers to maintain plant health."
        ]
    },
    "Healthy Maize": {
        "Remedies": [
            "Apply organic fertilizers for better yield.",
            "Ensure timely irrigation and pest control.",
            "Use high-quality, disease-resistant seeds."
        ],
        "Precautions": [
            "Regularly inspect for pests and diseases.",
            "Avoid waterlogging to prevent root diseases.",
            "Practice crop rotation for soil health."
        ]
    },
    "Healthy Wheat": {
        "Remedies": [
            "Use balanced fertilizers for healthy growth.",
            "Ensure proper irrigation and timely sowing.",
            "Monitor and control weeds effectively."
        ],
        "Precautions": [
            "Use disease-resistant wheat varieties.",
            "Avoid planting in infected soil.",
            "Implement proper field hygiene and sanitation."
        ]
    },
    "Healthy cotton": {
        "Remedies": [
            "Apply organic manure to improve soil health.",
            "Use drip irrigation to optimize water usage.",
            "Monitor and control pests regularly."
        ],
        "Precautions": [
            "Plant disease-resistant varieties.",
            "Avoid excessive use of chemical fertilizers.",
            "Ensure proper crop rotation to prevent soil depletion."
        ]
    },
    "Leaf Curl": {
        "Remedies": [
            "Spray neem oil or insecticides to control vector insects.",
            "Use resistant plant varieties.",
            "Apply fungicides if fungal infection is detected."
        ],
        "Precautions": [
            "Monitor for aphids and whiteflies, which spread the virus.",
            "Remove and destroy infected plants promptly.",
            "Avoid excessive nitrogen fertilization, which attracts pests."
        ]
    },
    "Leaf smut": {
        "Remedies": [
            "Use fungicide-treated seeds before planting.",
            "Practice crop rotation to break disease cycles.",
            "Maintain proper soil nutrition with balanced fertilizers."
        ],
        "Precautions": [
            "Remove and destroy infected plant parts.",
            "Ensure proper field drainage to prevent water stagnation.",
            "Avoid planting susceptible varieties in infected fields."
        ]
    },
     "Mango_Alternaria": {
        "Remedies": [
            "Apply fungicides like Mancozeb or Copper Oxychloride.",
            "Ensure proper orchard sanitation by removing infected plant debris."
        ],
        "Precautions": [
            "Avoid overhead irrigation to reduce leaf wetness.",
            "Use disease-resistant mango varieties where possible."
        ]
    },
    "Mango_Anthracnose": {
        "Remedies": [
            "Use fungicides like Carbendazim or Copper-based sprays.",
            "Prune affected branches to improve air circulation."
        ],
        "Precautions": [
            "Harvest fruits carefully to prevent mechanical injuries.",
            "Apply protective fungicide sprays before the flowering stage."
        ]
    },
    "Mango_Black Mould Rot": {
        "Remedies": [
            "Spray with Thiophanate-methyl or Carbendazim.",
            "Store harvested fruits in cool, dry conditions to prevent fungal growth."
        ],
        "Precautions": [
            "Avoid injury to fruits during harvesting and handling.",
            "Ensure proper ventilation in storage areas."
        ]
    },
    "Mango_Healthy": {
        "Remedies": [
            "No treatment needed as the plant is healthy."
        ],
        "Precautions": [
            "Regularly monitor for signs of disease.",
            "Use proper fertilization and irrigation practices."
        ]
    },
    "Mango_Stem end Rot": {
        "Remedies": [
            "Dip fruits in hot water (around 50°C) for 5 minutes to kill spores.",
            "Apply fungicides like Thiabendazole."
        ],
        "Precautions": [
            "Ensure proper drying of fruits before storage.",
            "Avoid mechanical injuries to the fruit."
        ]
    },
    "Mosaic sugarcane": {
        "Remedies": [
            "Remove and destroy infected plants to prevent spread.",
            "Use resistant sugarcane varieties."
        ],
        "Precautions": [
            "Control insect vectors like aphids.",
            "Avoid planting infected setts."
        ]
    },
    "Orange___Haunglongbing_(Citrus_greening)": {
        "Remedies": [
            "Remove and destroy infected trees.",
            "Use antibiotics like Oxytetracycline in early stages."
        ],
        "Precautions": [
            "Control psyllid insects that spread the disease.",
            "Use disease-free planting material."
        ]
    },
    "Peach___Bacterial_spot": {
        "Remedies": [
            "Apply copper-based bactericides before fruit set.",
            "Prune infected twigs and branches."
        ],
        "Precautions": [
            "Ensure good air circulation in orchards.",
            "Avoid overhead irrigation."
        ]
    },
    "Peach___healthy": {
        "Remedies": [
            "No treatment needed as the plant is healthy."
        ],
        "Precautions": [
            "Regularly inspect for early disease symptoms.",
            "Maintain proper irrigation and nutrition levels."
        ]
    },
    "Pepper,_bell___Bacterial_spot": {
        "Remedies": [
            "Apply copper-based fungicides.",
            "Use certified disease-free seeds."
        ],
        "Precautions": [
            "Rotate crops to reduce pathogen buildup.",
            "Avoid excessive nitrogen fertilization."
        ]
    },
    "Pepper,_bell___healthy": {
        "Remedies": [
            "No treatment needed as the plant is healthy."
        ],
        "Precautions": [
            "Regularly check for disease symptoms.",
            "Maintain good cultural practices to prevent infections."
        ]
    },
    "Potato___Early_blight": {
        "Remedies": [
            "Use fungicides like Chlorothalonil or Mancozeb.",
            "Remove and destroy infected leaves."
        ],
        "Precautions": [
            "Practice crop rotation to break disease cycles.",
            "Avoid planting in the same field year after year."
        ]
    },
    "Potato___Healthy": {
        "Remedies": [
            "No treatment needed as the plant is healthy."
        ],
        "Precautions": [
            "Monitor for early signs of disease.",
            "Use resistant potato varieties."
        ]
    },
    "Potato___Late_blight": {
        "Remedies": [
            "Apply fungicides like Metalaxyl or Mancozeb.",
            "Destroy infected plants to prevent spread."
        ],
        "Precautions": [
            "Ensure good drainage to reduce excess moisture.",
            "Plant certified disease-free seeds."
        ]
    },
    "RedRot sugarcane": {
        "Remedies": [
            "Use disease-resistant sugarcane varieties.",
            "Remove and destroy infected plants to prevent further spread.",
            "Apply fungicides like copper oxychloride as per recommendations."
        ],
        "Precautions": [
            "Ensure proper drainage to avoid water stagnation.",
            "Use certified disease-free planting material.",
            "Practice crop rotation to reduce pathogen buildup."
        ]
    },
    "RedRust sugarcane": {
        "Remedies": [
            "Spray sulfur-based fungicides to control rust spores.",
            "Improve field ventilation by maintaining proper plant spacing.",
            "Apply organic fertilizers to strengthen plant immunity."
        ],
        "Precautions": [
            "Avoid excessive nitrogen fertilizer use.",
            "Regularly monitor crops for early detection of symptoms.",
            "Use resistant sugarcane varieties if available."
        ]
    },
    "Rice Blast": {
        "Remedies": [
            "Use fungicides like Tricyclazole for effective control.",
            "Maintain proper plant spacing to improve air circulation.",
            "Apply balanced fertilizers, avoiding excess nitrogen."
        ],
        "Precautions": [
            "Use resistant rice varieties.",
            "Ensure timely irrigation and avoid water stress.",
            "Rotate crops to minimize pathogen survival."
        ]
    },
    "Rice_BrownSpot": {
        "Remedies": [
            "Apply potassium and phosphorus-rich fertilizers.",
            "Spray fungicides such as Mancozeb or Carbendazim.",
            "Use disease-free seeds for planting."
        ],
        "Precautions": [
            "Improve soil fertility with organic manure.",
            "Avoid moisture stress and maintain proper irrigation.",
            "Regularly inspect crops and remove infected leaves."
        ]
    },
    "Rice_Hispa": {
        "Remedies": [
            "Use insecticides like Chlorpyrifos to control larvae.",
            "Handpick and destroy affected leaves to reduce infestation.",
            "Introduce natural predators like parasitoid wasps."
        ],
        "Precautions": [
            "Avoid excessive nitrogen application.",
            "Ensure proper field sanitation to remove egg-laying sites.",
            "Plant early-maturing rice varieties to escape peak infestation."
        ]
    },
    "Rice_LeafBlast": {
        "Remedies": [
            "Spray fungicides like Isoprothiolane at early infection stages.",
            "Apply silicon-based fertilizers to strengthen plant defense.",
            "Maintain proper plant nutrition and avoid excessive nitrogen."
        ],
        "Precautions": [
            "Use resistant rice varieties.",
            "Maintain proper field hygiene and remove infected debris.",
            "Ensure timely irrigation to avoid water stress."
        ]
    },
    "Squash___Powdery_mildew": {
        "Remedies": [
            "Spray neem oil or sulfur-based fungicides.",
            "Remove and destroy infected leaves to prevent spread.",
            "Use biofungicides like Trichoderma."
        ],
        "Precautions": [
            "Ensure good air circulation by proper plant spacing.",
            "Avoid overhead watering to reduce leaf wetness.",
            "Plant resistant squash varieties."
        ]
    },
    "Strawberry___Leaf_scorch": {
        "Remedies": [
            "Apply copper-based fungicides to reduce infection.",
            "Remove and destroy infected leaves regularly.",
            "Improve soil drainage and avoid excessive moisture."
        ],
        "Precautions": [
            "Ensure proper air circulation around plants.",
            "Use disease-resistant strawberry cultivars.",
            "Practice crop rotation to reduce pathogen buildup."
        ]
    },
    "Sugarcane_Banded Chlorosis": {
        "Remedies": [
            "Apply iron and zinc supplements to correct deficiencies.",
            "Use organic compost to improve soil nutrient balance.",
            "Ensure proper irrigation to maintain soil health."
        ],
        "Precautions": [
            "Test soil regularly to monitor nutrient levels.",
            "Avoid excessive use of chemical fertilizers.",
            "Maintain optimal soil pH for nutrient absorption."
        ]
    },
    "Sugarcane_BrownRust": {
        "Remedies": [
            "Spray fungicides like Propiconazole or Tricyclazole.",
            "Grow rust-resistant varieties of sugarcane.",
            "Increase potassium fertilization to strengthen plant resistance."
        ],
        "Precautions": [
            "Avoid excessive nitrogen fertilization.",
            "Remove and destroy infected leaves to prevent spread.",
            "Implement crop rotation to break disease cycle."
        ]
    },
    "Sugarcane_Grassy shoot": {
        "Remedies": [
            "Use disease-free planting material.",
            "Apply systemic insecticides to control vector populations.",
            "Burn infected plant residues to prevent spread."
        ],
        "Precautions": [
            "Perform regular field inspections to detect early symptoms.",
            "Adopt clean cultivation practices.",
            "Avoid ratooning from infected fields."
        ]
    },
    "Sugarcane_Pokkah Boeng": {
        "Remedies": [
            "Use resistant sugarcane varieties.",
            "Apply recommended fungicides like Carbendazim.",
            "Ensure proper field drainage to avoid excess moisture."
        ],
        "Precautions": [
            "Avoid mechanical injuries to plants, which facilitate infection.",
            "Keep proper plant nutrition to improve plant resistance.",
            "Monitor fields during early growth stages for symptoms."
        ]
    },
    "Sugarcane_Sett Rot": {
        "Remedies": [
            "Treat setts with fungicides like Bavistin before planting.",
            "Use hot water treatment (50°C for 30 minutes) to kill pathogens.",
            "Improve soil drainage to prevent waterlogging."
        ],
        "Precautions": [
            "Avoid using infected setts for planting.",
            "Ensure proper drying of setts before storage.",
            "Use well-drained soil to reduce fungal growth risk."
        ]
    },
    "Sugarcane_Viral Disease": {
        "Remedies": [
            "Control vector insects like aphids and whiteflies using pesticides.",
            "Remove and destroy infected plants to prevent disease spread.",
            "Use virus-free seed materials from certified sources."
        ],
        "Precautions": [
            "Avoid planting sugarcane near virus-affected fields.",
            "Maintain proper plant spacing to reduce disease transmission.",
            "Regularly monitor crops for insect vectors."
        ]
    },
    "Sugarcane_Yellow Leaf": {
        "Remedies": [
            "Plant disease-free setts from certified sources.",
            "Control insect vectors like aphids using neem-based pesticides.",
            "Improve soil fertility through balanced fertilization."
        ],
        "Precautions": [
            "Avoid ratooning infected crops.",
            "Use intercropping techniques to reduce disease spread.",
            "Monitor fields regularly for early symptoms."
        ]
    },
    "Sugarcane_smut": {
        "Remedies": [
            "Destroy infected plants to prevent further spread.",
            "Apply fungicides like Carbendazim to prevent spore germination.",
            "Use resistant sugarcane varieties."
        ],
        "Precautions": [
            "Avoid planting sugarcane in fields previously affected by smut.",
            "Use healthy and treated setts for planting.",
            "Follow crop rotation practices to reduce disease persistence."
        ]
    },
    "Wheat Stem fly": {
        "Remedies": [
            "Use resistant wheat varieties.",
            "Apply insecticides like chlorpyrifos at early infestation stages.",
            "Remove and destroy infected plants to prevent further spread."
        ],
        "Precautions": [
            "Practice crop rotation to disrupt pest life cycles.",
            "Ensure proper field sanitation to remove host plants.",
            "Avoid late planting, as it increases susceptibility."
        ]
    },
    "Wheat aphid": {
        "Remedies": [
            "Spray neem oil or insecticidal soap to control aphids.",
            "Introduce natural predators like ladybugs and lacewings.",
            "Use systemic insecticides if infestation is severe."
        ],
        "Precautions": [
            "Monitor crops regularly for early detection.",
            "Encourage biodiversity by planting flowering plants around the field.",
            "Avoid excessive nitrogen fertilization, which attracts aphids."
        ]
    },
    "Wheat black rust": {
        "Remedies": [
            "Use rust-resistant wheat varieties.",
            "Apply fungicides like propiconazole or tebuconazole.",
            "Destroy infected plant debris to reduce fungal spores."
        ],
        "Precautions": [
            "Avoid planting wheat near barberry plants (alternate host).",
            "Maintain proper spacing to reduce humidity and spore transmission.",
            "Monitor fields regularly and apply preventive fungicides."
        ]
    },
    "Wheat leaf blight": {
        "Remedies": [
            "Apply fungicides such as mancozeb or copper oxychloride.",
            "Improve soil drainage and aeration.",
            "Use resistant wheat varieties."
        ],
        "Precautions": [
            "Rotate crops to minimize fungal survival.",
            "Avoid excessive nitrogen fertilization.",
            "Remove infected plant debris after harvest."
        ]
    },
    "Wheat mite": {
        "Remedies": [
            "Spray sulfur-based miticides.",
            "Encourage natural predators like predatory mites.",
            "Increase field humidity to deter mites."
        ],
        "Precautions": [
            "Avoid overuse of broad-spectrum pesticides that kill beneficial insects.",
            "Monitor plants regularly for early signs of mite infestation.",
            "Use proper irrigation to maintain soil health."
        ]
    },
    "Wheat powdery mildew": {
        "Remedies": [
            "Apply sulfur-based or systemic fungicides.",
            "Use resistant wheat varieties.",
            "Ensure good air circulation by proper spacing."
        ],
        "Precautions": [
            "Avoid excessive use of nitrogen fertilizers.",
            "Plant wheat in well-drained soil with good air circulation.",
            "Remove infected leaves promptly."
        ]
    },
    "Wheat scab": {
        "Remedies": [
            "Apply fungicides like tebuconazole at the flowering stage.",
            "Use disease-resistant wheat varieties.",
            "Avoid planting wheat in areas with previous scab infections."
        ],
        "Precautions": [
            "Practice crop rotation with non-host plants.",
            "Harvest at the right moisture level to prevent fungal growth.",
            "Improve field drainage to reduce humidity."
        ]
    },
    "Wheat___Yellow_Rust": {
        "Remedies": [
            "Use resistant wheat varieties.",
            "Apply fungicides such as propiconazole or triazoles.",
            "Remove volunteer wheat plants that harbor rust spores."
        ],
        "Precautions": [
            "Monitor crops regularly for rust symptoms.",
            "Avoid excessive irrigation, which promotes fungal growth.",
            "Plant at optimal spacing to ensure airflow."
        ]
    },
    "Wilt": {
        "Remedies": [
            "Use resistant crop varieties.",
            "Apply fungicides like carbendazim in early stages.",
            "Improve soil drainage to prevent waterlogging."
        ],
        "Precautions": [
            "Rotate crops with non-host plants.",
            "Maintain proper soil pH and fertility.",
            "Avoid excessive irrigation to reduce fungal spread."
        ]
    },
    "Yellow Rust Sugarcane": {
        "Remedies": [
            "Apply fungicides such as propiconazole.",
            "Plant rust-resistant sugarcane varieties.",
            "Destroy infected plant residues."
        ],
        "Precautions": [
            "Avoid planting in areas with a history of rust.",
            "Ensure proper field sanitation.",
            "Monitor fields regularly for early detection."
        ]
    },
    "bacterial_blight in Cotton": {
        "Remedies": [
            "Spray copper-based bactericides.",
            "Use disease-free seeds for planting.",
            "Improve field drainage to reduce bacterial spread."
        ],
        "Precautions": [
            "Rotate crops to minimize pathogen build-up.",
            "Avoid overhead irrigation.",
            "Remove and destroy infected plant parts."
        ]
    },
    "bollworm on Cotton": {
        "Remedies": [
            "Apply insecticides like spinosad or neem oil.",
            "Encourage natural predators like parasitic wasps.",
            "Use pheromone traps for early detection."
        ],
        "Precautions": [
            "Monitor cotton fields regularly.",
            "Avoid continuous planting of cotton.",
            "Destroy crop residues after harvest."
        ]
    },
     "bollworm on Cotton": {
        "Remedies": [
            "Use pheromone traps to monitor and control adult moths.",
            "Apply neem-based pesticides or biological control agents like Bacillus thuringiensis (Bt).",
            "Encourage natural predators such as Trichogramma wasps."
        ],
        "Precautions": [
            "Rotate crops to break the pest life cycle.",
            "Avoid excessive nitrogen fertilizers that promote lush growth.",
            "Use resistant cotton varieties where available."
        ]
    },
    "cotton mealy bug": {
        "Remedies": [
            "Spray neem oil or soap solution to remove mealy bugs.",
            "Introduce natural predators like ladybugs and parasitic wasps.",
            "Use systemic insecticides if infestation is severe."
        ],
        "Precautions": [
            "Avoid excessive use of nitrogen-based fertilizers.",
            "Keep fields weed-free as weeds can host mealy bugs.",
            "Regularly inspect plants for early signs of infestation."
        ]
    },
    "cotton whitefly": {
        "Remedies": [
            "Use yellow sticky traps to monitor and reduce whitefly populations.",
            "Spray neem oil or insecticidal soap to control whiteflies.",
            "Encourage natural enemies such as lacewings and ladybugs."
        ],
        "Precautions": [
            "Avoid planting crops that attract whiteflies near cotton fields.",
            "Maintain proper spacing and avoid overcrowding of plants.",
            "Regularly inspect the undersides of leaves for whitefly eggs and larvae."
        ]
    },
    "maize ear rot": {
        "Remedies": [
            "Use resistant maize varieties to minimize infection.",
            "Apply fungicides at early stages of infection.",
            "Harvest and dry maize properly to prevent fungal growth."
        ],
        "Precautions": [
            "Ensure proper field drainage to prevent excess moisture.",
            "Rotate maize crops with non-host crops to reduce pathogen buildup.",
            "Avoid mechanical damage to maize ears, which can lead to fungal infections."
        ]
    },
    "maize fall armyworm": {
        "Remedies": [
            "Use pheromone traps to monitor and control adult moths.",
            "Apply biological insecticides like Bacillus thuringiensis (Bt) sprays.",
            "Introduce natural predators such as birds and Trichogramma wasps."
        ],
        "Precautions": [
            "Practice intercropping with legumes to deter armyworms.",
            "Plant maize early in the season to avoid peak pest populations.",
            "Monitor crops regularly and remove affected plants to prevent spreading."
        ]
    },
    "maize stem borer": {
        "Remedies": [
            "Apply biological control agents like Trichogramma wasps.",
            "Use neem-based pesticides or Bt-based formulations.",
            "Destroy crop residues after harvest to eliminate larvae hiding places."
        ],
        "Precautions": [
            "Rotate maize with non-host crops to break the pest cycle.",
            "Use resistant maize varieties where available.",
            "Monitor crop regularly for early signs of infestation."
        ]
    },
    "pink bollworm in cotton": {
        "Remedies": [
            "Use pheromone traps to monitor and capture adult moths.",
            "Apply Bt cotton or neem-based pesticides.",
            "Practice timely harvesting to minimize pest spread."
        ],
        "Precautions": [
            "Destroy affected plant residues to prevent overwintering.",
            "Avoid late sowing of cotton to reduce pest infestation.",
            "Use resistant cotton varieties when available."
        ]
    },
    "red cotton bug": {
        "Remedies": [
            "Use neem oil or organic pesticides to control red cotton bugs.",
            "Handpick and destroy the bugs in early infestation stages.",
            "Encourage natural predators like birds and wasps."
        ],
        "Precautions": [
            "Remove weeds that serve as alternative hosts for the bug.",
            "Ensure proper crop rotation to reduce infestation risks.",
            "Regularly monitor fields to detect early signs of infestation."
        ]
    },
    "thirps on cotton": {
        "Remedies": [
            "Apply neem-based pesticides or insecticidal soaps.",
            "Encourage natural enemies like predatory mites and ladybugs.",
            "Use reflective mulch to deter thrips."
        ],
        "Precautions": [
            "Avoid excessive nitrogen fertilization, which attracts thrips.",
            "Monitor plants regularly for early detection of thrip damage.",
            "Maintain weed-free fields to eliminate alternative hosts."
        ]
    },
    "Tungro": {
        "Remedies": [
            "Use resistant rice varieties to minimize infection.",
            "Apply insecticides to control vector insects (leafhoppers).",
            "Remove and destroy infected plants to prevent spread."
        ],
        "Precautions": [
            "Avoid planting rice in areas with a history of Tungro disease.",
            "Practice synchronized planting to reduce vector populations.",
            "Ensure proper field sanitation by removing weeds and debris."
        ]
    },
    "Wheat Brown leaf Rust": {
        "Remedies": [
            "Apply fungicides like propiconazole at early stages of infection.",
            "Use resistant wheat varieties to prevent rust infections.",
            "Practice crop rotation to break the disease cycle."
        ],
        "Precautions": [
            "Avoid excessive nitrogen fertilization, which encourages disease development.",
            "Ensure proper spacing between plants for good air circulation.",
            "Regularly inspect fields for rust symptoms and take early action."
        ]
    }
}
def preprocess_image(img_path):
    img_size = (128, 128)
    img = image.load_img(img_path, target_size=img_size)
    img_array = image.img_to_array(img)
    img_array = np.expand_dims(img_array, axis=0)
    img_array = img_array / 255.0
    return img_array

def predict_image(img_path):
    processed_img = preprocess_image(img_path)
    predictions = loaded_model.predict(processed_img)
    predicted_class_index = np.argmax(predictions)
    predicted_label = class_labels[int(predicted_class_index)]
    confidence = float(np.max(predictions))
    return predicted_label, confidence

def get_sol(disease):
    if disease in solutions:
        remedies = "\n- ".join(solutions[disease]["Remedies"])
        precautions = "\n- ".join(solutions[disease]["Precautions"])
        return f"Solutions:\n- {remedies}\n\nPrecautions:\n- {precautions}"
    else:
        return "No solutions available."

def display_prediction(img_path):
    predicted_label, confidence = predict_image(img_path)
    img = cv2.imread(img_path)
    img = cv2.cvtColor(img, cv2.COLOR_BGR2RGB)
    plt.imshow(img)
    plt.axis("off")
    plt.title(f"Predicted: {predicted_label} ({confidence:.2f})")
    plt.show()

    print(f"Predicted Disease: {predicted_label} ({confidence:.2f})\n")
    print(get_sol(predicted_label))

# Test the model
# image_path = "E:\\NLP\\Hackethon\\dataset\\test\\Apple___Black_rot\\Apple___Black_rot (1).JPG"
# display_prediction(image_path)
