import random
from abc import ABC, abstractmethod


class GeneticMaterial(ABC):
    """Abstract Base Class providing polymorphic interface for mutations."""

    @abstractmethod
    def mutate(self, probability: float):
        pass

    @abstractmethod
    def is_complete(self) -> bool:
        """Returns True if all underlying genes are 1."""
        pass


class Gene(GeneticMaterial):
    """Represents a single binary gene (0 or 1)."""

    def __init__(self, value: int = None):
        self.value = value if value is not None else random.choice([0, 1])

    def mutate(self, probability: float):
        # 1/2 chance to flip IF selected by environmental mutation rate
        if random.random() < probability:
            if random.random() < 0.5:
                self.value = 1 if self.value == 0 else 0

    def is_complete(self) -> bool:
        return self.value == 1

    def __repr__(self):
        return str(self.value)


class Chromosome(GeneticMaterial):
    """Represents a series of 10 Genes."""

    def __init__(self, length: int = 10):
        self.genes = [Gene() for _ in range(length)]

    def mutate(self, probability: float):
        # Mutates contained genes based on probability
        for gene in self.genes:
            gene.mutate(probability)

    def is_complete(self) -> bool:
        return all(gene.is_complete() for gene in self.genes)

    def __repr__(self):
        return "".join(str(g) for g in self.genes)


class DNA(GeneticMaterial):
    """Represents a full DNA sequence of 10 Chromosomes (100 total Genes)."""

    def __init__(self, length: int = 10):
        self.chromosomes = [Chromosome() for _ in range(length)]

    def mutate(self, probability: float):
        # Delegates mutation downward to each chromosome
        for chromosome in self.chromosomes:
            chromosome.mutate(probability)

    def is_complete(self) -> bool:
        return all(c.is_complete() for c in self.chromosomes)

    def __repr__(self):
        return "-".join(str(c) for c in self.chromosomes)


class Organism:
    """Represents an organism containing a DNA sequence in an environment."""

    def __init__(self, dna: DNA = None, environment_mutation_rate: float = 0.5):
        self.dna = dna if dna is not None else DNA()
        self.environment = environment_mutation_rate

    def live_generation(self):
        """Triggers a mutation pass on the organism's DNA."""
        self.dna.mutate(self.environment)

    def is_target_reached(self) -> bool:
        return self.dna.is_complete()


# --- Evolutionary Simulation Loop ---
def run_simulation(num_organisms=5, mutation_rate=0.3):
    population = [Organism(environment_mutation_rate=mutation_rate) for _ in range(num_organisms)]
    generations = 0
    winner = None

    print(f"Starting evolutionary simulation ({num_organisms} organisms, Mutation Rate: {mutation_rate})...\n")

    while not winner:
        generations += 1
        for i, org in enumerate(population):
            org.live_generation()
            if org.is_target_reached():
                winner = (i + 1, org)
                break

    print(f"Target sequence achieved by Organism #{winner[0]} on Generation {generations}!")
    return generations


if __name__ == "__main__":
    results = run_simulation(num_organisms=10, mutation_rate=0.2)