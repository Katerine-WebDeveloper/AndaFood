from flask import Flask, request, jsonify, url_for, Blueprint
from api.models import db, User, Menu, MenuOptions, Reserva, ListaDeOrdenes
from api.utils import generate_sitemap, APIException
import mercadopago
import json
import os
import random
import string
import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart

from flask_jwt_extended import create_access_token
from flask_jwt_extended import get_jwt_identity
from flask_jwt_extended import jwt_required


import cloudinary
import cloudinary.uploader
from cloudinary.utils import cloudinary_url
from datetime import datetime

from flask_cors import CORS

app = Flask(__name__)
CORS(app)




sdk = mercadopago.SDK("APP_USR-7717264634749554-120508-c40d3f9932b4e9f7de4477bfa5ef733b-2136972767")



frontendurl = os.getenv("FRONTEND_URL")


cloudinary.config(
    cloud_name = "dqspjepfs",
    api_key = "992526845141794",
    api_secret = os.getenv("CLOUDINARY_SECRET_2", ""), # Click 'View API Keys' above to copy your API secret
    secure=True
)
api = Blueprint('api', __name__)

# Allow CORS requests to this API
CORS(api)

# Email Sender

aleatorio=""
sender_email = os.getenv("SMTP_USERNAME")
sender_password = os.getenv("SMTP_APP_PASSWORD")
smtp_host = os.getenv("SMTP_HOST")
smtp_port = os.getenv("SMTP_PORT")

# receivers_email = "fiorellaviscardi.2412@gmail.com", "natimartalvarez@gmail.com", "eliasmilano@gmail.com"

def send_singup_email(receivers_email):
   message = MIMEMultipart("alternative")

   message["Subject"] = "Bienvenido a Anda Food!"
   message["From"] = os.getenv("SMTP_USERNAME")
   message["To"] = ",".join(receivers_email)
    
   html_content = """
       <html>
           <body>
               <h1>Bienvenido a Anda Food!</h1>
               <p>¿Olvidaste la contraseña?</p>
               <p>Por favor, ingresa el correo electrónico que usas en la aplicación para continuar.</p>
           </body>
       </html>
   """
   text = "Correo enviado desde la API Anda Food. Saludos👋."

   message.attach(MIMEText(text, "plain"))
   message.attach(MIMEText(html_content, "html"))

   server = smtplib.SMTP(smtp_host, smtp_port)
   server.starttls()
   server.login(sender_email, sender_password)
   server.sendmail(sender_email, receivers_email, message.as_string())
   server.quit()

   
def generate_random_password(length=10):
  
  chars = string.ascii_letters + string.digits + string.punctuation
 
  password = ''.join(random.choice(chars) for _ in range(length))
  return password




@api.route('/send-email', methods=['PUT'])
def send_email():
   data=request.json
   receivers_email=data["email"]
   user_random_password=generate_random_password()
    
   exist_user=User.query.filter_by(email=receivers_email).first()
   
   if receivers_email is None :
       return jsonify({"msg":"Falta ingresar email"}),404
    
   if exist_user is None :
       return jsonify({"msg":"Usuario no registrado"}),404
    
    # if user_random_password==aleatorio:
   exist_user.password=user_random_password
   db.session.commit()
 

   message = MIMEMultipart("alternative")

   message["Subject"] = "Olvido de contraseña - Anda Food"
   message["From"] = "andamanagment@gmail.com"
   message["To"] = ",".join(receivers_email)
   

   html_content = f"""
       <html>
           <body>
               <h1>Bienvenido a Anda Food!</h1>
               <p>¿Olvidaste la contraseña?</p>
               <p>Tu password aleatorio es : {user_random_password}.</p>
               <p>Recuerda volver a la aplicacion web para continuar el cambio de contraseña</p>
           </body>
       </html>
   """
   text = "Correo enviado desde la API Anda Food. Saludos👋."

   message.attach(MIMEText(text, "plain"))
   message.attach(MIMEText(html_content, "html"))

   server = smtplib.SMTP(smtp_host, smtp_port)
   server.starttls()
   server.login(sender_email, sender_password)
   server.sendmail(sender_email, receivers_email, message.as_string())
   server.quit()

   return jsonify({"msg": "Correo enviado correctamente"}), 200


@api.route('/recuperar-password', methods=['PUT'])
def recuperar_password():
    data=request.json
    email=data.get("email")
    nueva=data.get("nueva")
    aleatoria=data.get("aleatoria")
   
    exist_user=User.query.filter_by(email=email).first()
   
    # if email is None :
    #    return jsonify({"msg":"Falta ingresar email"}),404
    
    if exist_user is None :
       return jsonify({"msg":"Usuario no registrado"}),401
    
    print(exist_user.password,aleatoria)

    if exist_user.password != aleatoria:
        return jsonify({"msg":"El password enviado no coincide"}),403
    
    # if user_random_password==aleatorio:
    exist_user.password=nueva
    db.session.commit()
    return jsonify({"msg":"Contraseña actualizada con exito"}),200
    # return jsonify({"msg":"Paso algo inesperado"}),500





@api.route('/hello', methods=['POST', 'GET'])
def handle_hello():
    response_body = {
        "message": "Hello! I'm a message that came from the backend, check the network tab on the google inspector and you will see the GET request"
    }
    return jsonify(response_body), 200


# Para crear los menu
@api.route('/menu', methods=['POST'])
def create_menu():
    body = request.form
    if not body or "day" not in body or "name" not in body or "description" not in body or "price" not in  body:
        raise APIException("Missing name, price, description, or img", status_code=400)
    day = body.get("day")
    name = body.get("name")
    description = body.get("description")
    price = body.get("price")
    img = request.files.get("img")

    try:
        upload_result = cloudinary.uploader.upload(img)
        img_url = upload_result["secure_url"]
    except:
        raise APIException("Image upload failed", status_code=500)

    new_menu = Menu(
        day=day,
        name=name,
        description=description,
        img=img_url,
        price=price
    )

    db.session.add(new_menu)
    db.session.commit()
    

    return jsonify({"msg": "Menu created successfully"}), 200


@api.route('/menu/<string:day>', methods=['GET'])
def get_menu_by_day(day):
    menu = Menu.query.filter_by(day=day).all()

    if not menu:
        return jsonify({"msg": "No menus found"}), 404
    menu_list = []
    for item in menu:
        menu_list.append({
            "id": item.id,
            "day": item.day,
            "name": item.name,
            "description": item.description,
            "price": item.price,
            "img": item.img
        })
    return jsonify(menu_list), 200


@api.route('/menuoptions', methods=['POST'])
def create_options():
    body = request.form

    if not body or "name" not in body or "price" not in body :
        raise APIException("Missing name, price, or img", status_code=400)

    name = body.get("name")
    price = body.get("price")

    img = request.files["img"]

   
    try:
        upload_result = cloudinary.uploader.upload(img)
        img_url = upload_result["secure_url"]
    except:
        raise APIException("Image upload failed", status_code=500)


    new_option = MenuOptions(
        name=name,
        img=img_url,
        price=price
    )

    db.session.add(new_option)
    db.session.commit()

    return jsonify({"msg": "Menu option created successfully"}), 200


@api.route('/menuoptions', methods=['GET'])
def get_option():
   
    options = MenuOptions.query.all()

    if not options:
        return jsonify({"msg": "No menus found"}), 404

    option_list = [] 
    for item in options:
        option_list.append(item.serialize())

    return jsonify(option_list), 200



@api.route("/preference", methods=["POST"]) 
def preference(): 
    body = json.loads(request.data)
    total = body["total"]
    # Crea un ítem en la preferencia
    preference_data = {
        "items": [
            {
                "title": "Anda Food",
                "quantity": 1,
                "unit_price": total
            }
        ],
        "payer": {
            "email": "test_user_17805074@testuser.com"
        },
       "back_urls": { 
            "success": f"{frontendurl}menu", 
            "failure": f"{frontendurl}menu", 
            "pending": f"{frontendurl}menu",

            # que url es la que va aca . o implementar backendurl
        },
        "auto_return": "approved"
    }
    preference_response = sdk.preference().create(preference_data)
    preference = preference_response["response"]
    return jsonify(preference), 200
    # return jsonify({"init_point": preference["init_point"]}), 200


# Para inicio de sesión
@api.route('/signup', methods=['POST'])
def register():
    data= request.json
    name = data.get("name")
    last_name=data.get("last_name")
    email = data.get("email")
    password = data.get("password")
    num_funcionario=data.get("num_funcionario")

    exist_user = User.query.filter_by(email=email).first()
    if exist_user:
        return jsonify({"msg":"El usuario ya existe"}),400
    new_user = User(
        name = name,
        email = email ,
        last_name=last_name,
        password = password ,
        num_funcionario = num_funcionario
    )
    db.session.add(new_user)
    db.session.commit()
    send_singup_email([email])
    return jsonify({"message":"User created successfully"}),201


        
# katte login
@api.route('/login', methods=['POST'])
def login():
    data= request.json
    #info desde el frontend
    email = data.get("email", None)
    password = data.get("password", None)

    user=User.query.filter_by(email=email).one_or_none()

    if user == None:
        return jsonify({"msg": f"Bad email or password"}), 404

    if email != user.email or password != user.password:
        return jsonify({"msg": "Bad username or password"}), 401
    access_token = create_access_token(identity=email)
    return jsonify(access_token=access_token, user=user.serialize()),200

@api.route('/user/profile', methods=['GET'])
@jwt_required()
def get_user_profile():
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    return jsonify(user.serialize()), 200

@api.route("/protected", methods=["GET"])
@jwt_required()
def protected():
    # Access the identity of the current user with get_jwt_identity
    current_user = get_jwt_identity()
    return jsonify(logged_in_as=current_user), 200

# Endpoint para guardar reservas
@api.route('/reservations', methods=['POST'])
@jwt_required()
def guardar_reserva():
    data = request.json
    email = get_jwt_identity()
    user = User.query.filter_by(email=email).first()
    nueva_reserva = Reserva(user_id=user.id, 
                            lunes=data['lunes'], 
                            martes=data['martes'], 
                            miercoles=data['miercoles'], 
                            jueves=data['jueves'], 
                            viernes=data['viernes'], 
                            sabado=data['sabado'])
    db.session.add(nueva_reserva)
    db.session.commit()
    return jsonify({"message": "Reserva guardada con éxito"}), 200
    

# # Endpoint para traer reservas de un usuario
# @api.route('/reservations', methods=['GET'])
# def get_reservas():
#     try:
#         reservas = Reserva.query.all()
#         reservas_serializadas = [reserva.serialize() for reserva in reservas]
#         return jsonify(reservas_serializadas), 200
#     except Exception as e:
#         return jsonify({"error": str(e)}), 400


# Endpoint para traer reservas de un usuario
@api.route('/reservations', methods=['GET'])
@jwt_required()
def get_reservas_by_email():
    try:
        #email = request.json.get('email')
        email = get_jwt_identity()
        if not email:
            return jsonify({"error": "Email parameter is required"}), 400

        user = User.query.filter_by(email=email).first()
        if not user:
            return jsonify({"error": "User not found"}), 404

        reservas = Reserva.query.filter_by(user_id=user.id).all()
        reservas_list = [reserva.serialize() for reserva in reservas]
        
        return jsonify(reservas_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400


# Endpoint para traer reservas de todos los usuarios
@api.route('/users_reservations', methods=['GET'])
def get_allReservations():
    try:
        data = request.json
        hora = data["hora"]
        dia = data["dia"]
        if dia == "Lunes" : 
            reservas = Reserva.query.filter_by(lunes=hora).all()
        if dia == "Martes" : 
            reservas = Reserva.query.filter_by(martes=hora).all()
        if dia == "Miercoles" : 
            reservas = Reserva.query.filter_by(miercoles=hora).all()
        if dia == "Jueves" : 
            reservas = Reserva.query.filter_by(jueves=hora).all()
        if dia == "Viernes" : 
            reservas = Reserva.query.filter_by(viernes=hora).all()
        if dia == "Sabado" : 
            reservas = Reserva.query.filter_by(sabado=hora).all()

        reservas_list = [item.serialize() for item in reservas]
        return jsonify(reservas_list), 200
    except Exception as e:
        return jsonify({"error": str(e)}), 400

# Endpoint para borrar reservas de un usuario
@api.route('/reservations', methods=['DELETE'])
@jwt_required()
def delete_reservation_by_email():
    # Obtener el email desde los parámetros de la solicitud
    email = get_jwt_identity()

    if not email:
        return jsonify({"error": "Email is required"}), 400

    user = User.query.filter_by(email=email).first()
    if not user:
        return jsonify({"error": "User not found"}), 404

    try:
        reservas = Reserva.query.filter_by(user_id=user.id).all()
        if not reservas:
            return jsonify({"message": "No hay reservas para este usuario"}), 404

        for reserva in reservas:
            db.session.delete(reserva)
        db.session.commit()

        return jsonify({"message": f"Todas las reservas para este usuario han sido borradas exitosamente"}), 200
    except Exception as e:
        db.session.rollback()
        return jsonify({"error": "Ha ocurrido un error durante la eliminación de las reservas", "detalles": str(e)}), 500

# Lista de ordenes POST & GET

from flask_cors import cross_origin


@api.route("/ordenes", methods=["POST"])
# @cross_origin(origins="*")
def create_order():
    try:
        data = request.get_json()

        # if not isinstance(data, list):  # Verificar si es un array
        #     raise APIException("Expected a list of orders", status_code=400)

        user_id = data.get("user_id")
        menu_id = data.get("menu_id")
        # menu_day = data.get("menu_day")
        cantidad = data.get("cantidad")
        option_id = data.get("option_id")
        total_price= data.get("total_price")
        fecha_orden= data.get("fecha_orden")

            # Validate data
        if not user_id or not cantidad:
            raise APIException("Missing required fields", status_code=400)

          
        nueva_orden = ListaDeOrdenes(
            user_id=user_id,
            menu_id=menu_id,
            # menu_day=menu_day,
            cantidad=cantidad,
            option_id=option_id,
            total_price=total_price,
            fecha_orden=datetime.now()
        )

        db.session.add(nueva_orden)
           
        db.session.commit()

        return jsonify({"MSG": "Orden creada"}), 201

    except APIException as e:
        return jsonify({"error": e.message}), e.status_code
    except Exception as e:
        # Log the error for debugging
        print(f"Error creating order: {str(e)}")
        return jsonify({"error": "An error occurred while creating the orders"}), 500


@api.route("/ordenes", methods=["GET"])
@cross_origin(origins="*")  # Allow all origins for this route
def get_orders():
    # Obtener todas las órdenes de la base de datos
    orders = ListaDeOrdenes.query.all()
    
    # Serializar las órdenes
    serialized_orders = [order.serialize() for order in orders]
    
    return jsonify(serialized_orders), 200

@api.route("/ordenes/<int:id>", methods=["GET"])
@cross_origin(origins="*")  # Allow all origins for this route
def get_order(id):
    # Buscar la orden por ID
    order = ListaDeOrdenes.query.get(id)

    if order is None:
        return jsonify({"message": "Orden no encontrada"}), 404
    
    # Responder con los detalles de la orden
    return jsonify(order.serialize()), 200

@api.route("/ordenes/<int:id>", methods=["DELETE"])
@cross_origin(origins="*")  # Allow all origins for this route
def delete_order(id):
    # Buscar la orden por ID
    order = ListaDeOrdenes.query.get(id)
    
    if order is None:
        return jsonify({"message": "Orden no encontrada"}), 404
    
    # Eliminar la orden
    db.session.delete(order)
    db.session.commit()
    
    return jsonify({"message": "Orden eliminada exitosamente"}), 200
