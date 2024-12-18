from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class User(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), unique=False, nullable=False)
    last_name = db.Column(db.String(100), unique=False, nullable=False)
    email = db.Column(db.String(120), unique=True, nullable=False)
    password = db.Column(db.String(80), unique=False, nullable=False)
    is_active = db.Column(db.Boolean(), unique=False, nullable=False)
    num_funcionario = db.Column(db.Integer, unique=True, nullable=False)
    is_admin = db.Column(db.Boolean(), nullable=True, default=False)
    reserva = db.relationship("Reserva", backref="user")

    def __repr__(self):
        return f'<User {self.email}>'

    def __init__(self, name, email,last_name, password,num_funcionario,is_admin=False):
        self.name = name
        self.last_name=last_name
        self.email = email
        self.password = password
        self.is_active = True
        self.num_funcionario = num_funcionario
        self.is_admin = is_admin
        

    def serialize(self):
        return {
           "id":self.id,
            "name":self.name,
            "last_name":self.last_name,
            "email":self.email,
            "is_active":self.is_active,
            "num_funcionario":self.num_funcionario,
            "is_admin":self.is_admin,
            "reserva":[res.id for res in self.reserva] if self.reserva else []
            
        }

    # menus = db.relationship('Menu', backref='user', lazy=True)

#Menú
class Menu(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    day = db.Column(db.String(50), nullable=False)
    name = db.Column(db.String(100), nullable=False)
    description = db.Column(db.String(255), nullable=True)
    img = db.Column(db.String(1000), nullable=False)
    price = db.Column(db.Float, nullable=False)
    

    def __repr__(self):
        return f'<Menu {self.name}>'
     
    def __init__(self, day,name,description, img, price):
        self.day = day
        self.name= name
        self.description = description
        self.img = img
        self.price= price

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "description": self.description,
            "img": self.img,
            "price": self.price
        }



#MenuOptions
class MenuOptions(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    name = db.Column(db.String(100), nullable=False)
    img = db.Column(db.String(1000), nullable=False)
    price = db.Column(db.Float, nullable=False)

    def __repr__(self):
        return f'<MenuOptions {self.name}>'
     
    def __init__(self,name, img, price):
        self.name=name
        self.img = img
        self.price= price

    def serialize(self):
        return {
            "id": self.id,
            "name": self.name,
            "img": self.img,
            "price": self.price,
        }

#user_id = db.Column(db.Integer, db.ForeignKey('user.id'), nullable=False)  es asi, cada menú está asociado a un único usuario?????

class Reserva(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"))
    #user = db.relationship("User", backref="reserva")
    lunes = db.Column(db.String(20), nullable=True)
    martes = db.Column(db.String(20), nullable=True)
    miercoles = db.Column(db.String(20), nullable=True)
    jueves = db.Column(db.String(20), nullable=True)
    viernes = db.Column(db.String(20), nullable=True)
    sabado = db.Column(db.String(20), nullable=True)
    
    def __repr__(self):
        return f'<Reserva {self.user_id}>'

    def serialize(self):
        return {
            "id": self.id,
            "user":self.user_id,          
            "user_id": self.user_id,
            "lunes":self.lunes,
            "martes":self.martes,
            "miercoles":self.miercoles,
            "jueves":self.jueves,
            "viernes":self.viernes,
            "sabado":self.sabado,
        }
            
# ListaDeOrdenes

from datetime import datetime

class ListaDeOrdenes(db.Model):
    id = db.Column(db.Integer, primary_key=True)
    user_id = db.Column(db.Integer, db.ForeignKey("user.id"), nullable=False)
    menu_id = db.Column(db.Integer, db.ForeignKey("menu.id"), nullable=True)
    option_id = db.Column(db.Integer, db.ForeignKey("menu_options.id"), nullable=True)
    cantidad = db.Column(db.Integer, nullable=False, default=1)
    total_price = db.Column(db.String(20), nullable=False)
    fecha_orden = db.Column(db.DateTime, nullable=False, default=datetime.utcnow)

    user = db.relationship("User", backref="lista_de_ordenes")
    menu = db.relationship("Menu", backref="lista_de_ordenes")
    option = db.relationship("MenuOptions", backref="lista_de_ordenes")

    def __repr__(self):
        return f'<ListaDeOrdenes {self.id}>'

    def __init__(self, user_id, menu_id, cantidad, option_id, total_price, fecha_orden):
        self.user_id = user_id
        self.menu_id = menu_id
        self.cantidad = cantidad
        self.option_id = option_id
        self.total_price = total_price
        self.fecha_orden = fecha_orden

    def calculate_total_price(self):
        # Ensure menu and menu_option are not None before accessing their attributes
        if not self.menu:
            raise ValueError("Menu not found")

        menu_price = float(self.menu.price) if self.menu and self.menu.price else 0
        option_price = float(self.option.price) if self.option and self.option.price else 0

        return str((menu_price + option_price) * self.cantidad)

    def serialize(self):
        return {
            "id": self.id,
            "user_id": self.user_id,
            "menu_id": self.menu_id,
            "option_id": self.option_id,
            "cantidad": self.cantidad,
            "total_price": self.total_price,
            "fecha_orden": self.fecha_orden,
            "menu_name": self.menu.name if self.menu else None,
            "menu_img": self.menu.img if self.menu else None,
            "option_name": self.option.name if self.option else None,
            "option_img": self.option.img if self.option else None,
        }
