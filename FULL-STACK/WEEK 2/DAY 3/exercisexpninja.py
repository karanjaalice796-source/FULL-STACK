from abc import ABC, abstractmethod


class Temperature(ABC):
    unit_symbol = '?'

    def __init__(self, value):
        self.value = value

    @abstractmethod
    def to_celsius(self):
        """Return this temperature's value expressed in Celsius."""
        raise NotImplementedError

    @classmethod
    @abstractmethod
    def from_celsius(cls, celsius_value):
        """Build an instance of this class from a Celsius value."""
        raise NotImplementedError

    def convert_to(self, target_cls):
        celsius_value = self.to_celsius()
        return target_cls.from_celsius(celsius_value)

    def __str__(self):
        return f'{self.value:.2f}°{self.unit_symbol}'

    def __repr__(self):
        return f'{self.__class__.__name__}({self.value})'


class Celsius(Temperature):
    unit_symbol = 'C'

    def to_celsius(self):
        return self.value

    @classmethod
    def from_celsius(cls, celsius_value):
        return cls(celsius_value)


class Kelvin(Temperature):
    unit_symbol = 'K'

    def to_celsius(self):
        return self.value - 273.15

    @classmethod
    def from_celsius(cls, celsius_value):
        return cls(celsius_value + 273.15)


class Fahrenheit(Temperature):
    unit_symbol = 'F'

    def to_celsius(self):
        return (self.value - 32) * 5 / 9

    @classmethod
    def from_celsius(cls, celsius_value):
        return cls(celsius_value * 9 / 5 + 32)


if __name__ == '__main__':
    freezing = Celsius(0)
    print(freezing)                      
    print(freezing.convert_to(Kelvin))   
    print(freezing.convert_to(Fahrenheit)) 

    boiling = Fahrenheit(212)
    print(boiling.convert_to(Celsius)) 
    print(boiling.convert_to(Kelvin))   

    body_temp = Kelvin(310.15)
    print(body_temp.convert_to(Fahrenheit))

import random


class QuantumParticle:
    _counter = 0

    def __init__(self, x=None, p=None, name=None):
        QuantumParticle._counter += 1
        self.name = name or f'p{QuantumParticle._counter}'

        self.x = x if x is not None else random.randint(1, 10_000)
        self.p = p if p is not None else round(random.uniform(0, 1), 4)
        self.spin_value = None
        self.entangled_with = None

    def _disturb(self):
        self.x = random.randint(1, 10_000)
        self.p = round(random.uniform(0, 1), 4)
        print('Quantum Interferences!!')

    def position(self):
        self.x = random.randint(1, 10_000)
        self._disturb()
        return self.x

    def momentum(self):
        self.p = round(random.uniform(0, 1), 4)
        self._disturb()
        return self.p

    def spin(self):
        self.spin_value = random.choice([0.5, -0.5])
        self._disturb()

        if self.entangled_with is not None:
            self.entangled_with.spin_value = -self.spin_value
            print('Spooky Action at a Distance !!')

        return self.spin_value

    def entangle(self, other):
        if not isinstance(other, QuantumParticle):
            raise TypeError('Can only entangle with another QuantumParticle instance.')

        self.entangled_with = other
        other.entangled_with = self
        print(f'Particle {self.name} is now in quantum entanglement with Particle {other.name}')

    def __repr__(self):
        return (f'QuantumParticle(name={self.name!r}, position={self.x}, '
                f'momentum={self.p}, spin={self.spin_value})')


if __name__ == '__main__':
    p1 = QuantumParticle(x=1, p=5.0)
    p2 = QuantumParticle(x=2, p=5.0)
    p1.entangle(p2)
    # Particle p1 is now in quantum entanglement with Particle p2

    print(repr(p1))
    print(repr(p2))

    print('--- measuring p1 spin ---')
    p1.spin()   # prints 'Quantum Interferences!!' then 'Spooky Action at a Distance !!'
    print(repr(p1))
    print(repr(p2))   # p2's spin should now be the opposite of p1's

    print('--- entangling with a non-particle ---')
    try:
        p1.entangle('not a particle')
    except TypeError as e:
        print(f'Caught expected error: {e}')