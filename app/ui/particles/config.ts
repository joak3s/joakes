interface ParticleConfig {
  particles: {
    number: {
      value: number;
      density: {
        enable: boolean;
        value_area: number;
      };
    };
    size: {
      value: number;
      random: boolean;
      min: number;
      max: number;
    };
    opacity: {
      value: number;
      random: boolean;
      min: number;
      max: number;
    };
    movement: {
      speed: number;
      direction: string;
      random: boolean;
      straight: boolean;
      outMode: string;
    };
    interactivity: {
      repulse: {
        distance: number;
        strength: number;
      };
      push: {
        particles_nb: number;
      };
    };
  };
  responsive: Array<{
    breakpoint: number;
    options: {
      particles: {
        number: {
          value: number;
        };
      };
    };
  }>;
}

export const particleConfig: ParticleConfig = {
  particles: {
    number: {
      value: 48,
      density: {
        enable: true,
        value_area: 800,
      },
    },
    size: {
      value: 3,
      random: true,
      min: 0.5,
      max: 3,
    },
    opacity: {
      value: 0.8,
      random: true,
      min: 0.1,
      max: 0.8,
    },
    movement: {
      speed: 0.06,
      direction: "none" as const,
      random: false,
      straight: false,
      outMode: "wrap" as const,
    },
    interactivity: {
      repulse: {
        distance: 12,
        strength: 0.5,
      },
      push: {
        particles_nb: 2,
      },
    },
  },
  responsive: [
    {
      breakpoint: 768,
      options: {
        particles: {
          number: {
            value: 25,
          },
        },
      },
    },
    {
      breakpoint: 480,
      options: {
        particles: {
          number: {
            value: 15,
          },
        },
      },
    },
  ],
}; 