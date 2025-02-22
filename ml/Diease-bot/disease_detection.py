

import tensorflow as tf
print(tf.__version__)


import numpy as np
import pandas as pd
import keras
import os
os.environ['TF_CPP_MIN_LOG_LEVEL'] = '2'
import tensorflow as tf
from tensorflow.keras import layers
from tensorflow.keras.preprocessing.image import ImageDataGenerator
from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import (Conv2D, MaxPooling2D, BatchNormalization,
                                     Dropout, Flatten, Dense)
from tensorflow.keras.layers import Dense, Flatten, Dropout, GlobalAveragePooling2D
from tensorflow.keras.applications import EfficientNetB0

from tensorflow.keras.optimizers import Adam
from sklearn.model_selection import train_test_split
import matplotlib.pyplot as plt
from keras.regularizers import l2

# Enable mixed precision for performance
tf.keras.mixed_precision.set_global_policy('mixed_float16')

# Enable XLA for faster computations
tf.config.optimizer.set_jit(True)



from tensorflow.keras.mixed_precision import set_global_policy

# Set global policy to mixed precision
set_global_policy('mixed_float16')

print("Mixed precision enabled.")


import tensorflow as tf


# Dataset paths
dataset_path = "/home/shravani/hackathon/Hackethon/dataset"
train_dir = os.path.join(dataset_path, "train")
valid_dir = os.path.join(dataset_path, "test")
test_dir = os.path.join(dataset_path, "validation")

print("Training Data Path:", train_dir)
print("Validation Data Path:", valid_dir)
print("Testing Data Path:", test_dir)

# Image settings
img_size = (128,128)
batch_size = 32

# Optimized Data Augmentation with efficient pipelines
train_datagen = ImageDataGenerator(
    rescale=1.0 / 255.0,
    rotation_range=20,
    width_shift_range=0.2,
    height_shift_range=0.2,
    zoom_range=0.2,
    horizontal_flip=True,
    preprocessing_function=tf.keras.applications.efficientnet.preprocess_input
)

val_datagen = ImageDataGenerator(rescale=1.0 / 255.0)

train_generator = train_datagen.flow_from_directory(
    train_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode="categorical",
    shuffle=True
)

val_generator = val_datagen.flow_from_directory(
    valid_dir,
    target_size=img_size,
    batch_size=batch_size,
    class_mode="categorical"
)

# Model Architecture using EfficientNetB0
base_model = EfficientNetB0(weights='imagenet', include_top=False, input_shape=(128, 128, 3))
base_model.trainable = False

model = Sequential([
    base_model,
    GlobalAveragePooling2D(),
    Dense(512, activation='relu'),
    Dropout(0.4),
    Dense(train_generator.num_classes, activation='softmax')
])

model.compile(
    optimizer=Adam(learning_rate=0.001),
    loss="categorical_crossentropy",
    metrics=["accuracy"]
)

# Data Augmentation
# train_datagen = ImageDataGenerator(
#     rescale = 1.0 / 255.0,
#     rotation_range = 30,
#     width_shift_range = 0.3,
#     height_shift_range = 0.3,
#     shear_range=0.3,
#     zoom_range=0.3,
#     horizontal_flip=True,
#     brightness_range=[0.8, 1.2],
#     fill_mode="nearest",
#     samplewise_center=True,
#     samplewise_std_normalization=True
# )

# val_datagen = ImageDataGenerator(rescale=1.0 / 255.0)

# train_generator = train_datagen.flow_from_directory(
#     train_dir,
#     target_size=img_size,
#     batch_size=batch_size,
#     class_mode="categorical",
# )

# val_generator = val_datagen.flow_from_directory(
#     valid_dir,
#     target_size=img_size,
#     batch_size=batch_size,
#     class_mode="categorical",
# )

# class_names = list(train_generator.class_indices.keys())
# num_classes = len(class_names)
# print("Classes:", class_names)

from tensorflow.keras.models import Sequential
from tensorflow.keras.layers import Conv2D, MaxPooling2D, BatchNormalization, Dropout, Flatten, Dense
from keras.regularizers import l2

class_names = list(train_generator.class_indices.keys())
num_classes = len(class_names)
print("Classes:", class_names)

# CNN Model
model = Sequential([
    Conv2D(512, kernel_size=(3, 3), kernel_regularizer=l2(0.01), activation='relu', input_shape=(128, 128, 3)),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),

    Conv2D(256, kernel_size=(3, 3), kernel_regularizer=l2(0.01), activation='relu'),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),

    Conv2D(256, kernel_size=(3, 3), kernel_regularizer=l2(0.01), activation='relu'),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),

    Conv2D(128, kernel_size=(3, 3), kernel_regularizer=l2(0.01), activation='relu'),
    BatchNormalization(),
    MaxPooling2D(pool_size=(2, 2)),

    Flatten(),
    Dense(512, activation='relu', kernel_regularizer=l2(0.01)),
    BatchNormalization(),
    Dropout(0.5),
    Dense(256, activation='relu', kernel_regularizer=l2(0.01)),
    BatchNormalization(),
    Dropout(0.5),
    Dense(num_classes, activation='softmax', kernel_regularizer=l2(0.01))
])

model.compile(optimizer=Adam(learning_rate=0.001),
              loss="categorical_crossentropy",
              metrics=["accuracy"])

# Learning Rate Scheduler
from tensorflow.keras.callbacks import LearningRateScheduler # Import LearningRateScheduler

# Learning Rate Scheduler
def lr_scheduler(epoch, lr):
    return lr * 0.95 if epoch > 5 else lr

callback = LearningRateScheduler(lr_scheduler)

# Train Model
with tf.device('/GPU:0'):
    history = model.fit(
        train_generator,
        validation_data=val_generator,
        epochs=1,
        steps_per_epoch=len(train_generator),
        validation_steps=len(val_generator),
        callbacks=[callback]
    )

# Save Model
model.save("gpu_trained_model.h5")

# Plot Results
plt.figure(figsize=(12, 4))
plt.subplot(1, 2, 1)
plt.plot(history.history["accuracy"], label="Train Accuracy")
plt.plot(history.history["val_accuracy"], label="Validation Accuracy")
plt.legend()
plt.title("Model Accuracy")

plt.subplot(1, 2, 2)
plt.plot(history.history["loss"], label="Train Loss")
plt.plot(history.history["val_loss"], label="Validation Loss")
plt.legend()
plt.title("Model Loss")

plt.show()

