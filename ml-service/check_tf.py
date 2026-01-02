
try:
    import tensorflow as tf
    print(f"TF Version: {tf.__version__}")
    from tensorflow import keras
    print("Keras imported successfully")
except Exception as e:
    print(f"Import failed: {e}")
    import traceback
    traceback.print_exc()
