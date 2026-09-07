import math


class Circle:
    def __init__(self, radius=None, diameter=None):
        if radius is None and diameter is None:
            raise ValueError('You must specify either a radius or a diameter.')
        if radius is not None and diameter is not None:
            raise ValueError('Specify only one of radius or diameter, not both.')

        if radius is not None:
            self.radius = radius
        else:
            self.diameter = diameter

    @property
    def radius(self):
        return self._radius

    @radius.setter
    def radius(self, value):
        if value <= 0:
            raise ValueError('Radius must be positive.')
        self._radius = value

    @property
    def diameter(self):
        return self._radius * 2

    @diameter.setter
    def diameter(self, value):
        if value <= 0:
            raise ValueError('Diameter must be positive.')
        self._radius = value / 2

    def area(self):
        return math.pi * self._radius ** 2

    def __str__(self):
        return f'Circle(radius={self.radius:.2f}, diameter={self.diameter:.2f}, area={self.area():.2f})'

    def __repr__(self):
        return f'Circle(radius={self.radius:.2f})'

    def __add__(self, other):
        if not isinstance(other, Circle):
            raise TypeError(f'Cannot add Circle and {type(other).__name__}')
        return Circle(radius=self.radius + other.radius)

    def __eq__(self, other):
        if not isinstance(other, Circle):
            return NotImplemented
        return self.radius == other.radius

    def __lt__(self, other):
        if not isinstance(other, Circle):
            return NotImplemented
        return self.radius < other.radius

    def __gt__(self, other):
        if not isinstance(other, Circle):
            return NotImplemented
        return self.radius > other.radius

    def __le__(self, other):
        if not isinstance(other, Circle):
            return NotImplemented
        return self.radius <= other.radius

    def __ge__(self, other):
        if not isinstance(other, Circle):
            return NotImplemented
        return self.radius >= other.radius


if __name__ == '__main__':
    c1 = Circle(radius=5)
    c2 = Circle(diameter=20)   # radius 10
    c3 = Circle(radius=5)

    print(c1)                  # Circle(radius=5.00, diameter=10.00, area=78.54)
    print(c2)                  # Circle(radius=10.00, diameter=20.00, area=314.16)

    print(c1.radius, c1.diameter)   # 5 10.0
    print(c2.radius, c2.diameter)   # 10.0 20.0

    c4 = c1 + c2
    print(c4)                  # Circle(radius=15.00, ...)

    print(c1 == c3)            # True
    print(c1 == c2)            # False
    print(c2 > c1)             # True
    print(c1 < c2)             # True

    circles = [c2, c1, c4, c3]
    for circle in sorted(circles):
        print(circle)