import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

async function main() {
  console.log('Iniciando seed do banco…');


  await prisma.appointment.deleteMany();
  await prisma.doctorSchedule.deleteMany();
  await prisma.doctor.deleteMany();
  await prisma.patient.deleteMany();


  const medico1 = await prisma.doctor.create({
    data: {
      name: 'Dr. Carlos Silva',
      specialty: 'Diagnóstico Clínico',
      consultationPrice: 500.0,
      schedules: {
        create: {
          availableFromWeekDay: 1,
          availableToWeekDay: 5,
          availableFromTime: '09:00:00',
          availableToTime: '17:00:00',
        },
      },
    },
  });

  const medico2 = await prisma.doctor.create({
    data: {
      name: 'Dr. Ricardo Fernandes',
      specialty: 'Cirurgião',
      consultationPrice: 1000.0,
      schedules: {
        create: {
          availableFromWeekDay: 1,
          availableToWeekDay: 3,
          availableFromTime: '10:00:00',
          availableToTime: '16:00:00',
        },
      },
    },
  });


  const medico3 = await prisma.doctor.create({
    data: {
      name: 'Dr. João Souza',
      specialty: 'Clínico Geral',
      consultationPrice: 300.0,
      schedules: {
        create: [
          {
            availableFromWeekDay: 1,
            availableToWeekDay: 2,
            availableFromTime: '08:00:00',
            availableToTime: '12:00:00',
          },
          {
            availableFromWeekDay: 4,
            availableToWeekDay: 5,
            availableFromTime: '14:00:00',
            availableToTime: '18:00:00',
          },
        ],
      },
    },
  });

  const medico4 = await prisma.doctor.create({
    data: {
      name: 'Dra. Ana Costa',
      specialty: 'Veterinária',
      consultationPrice: 200.0,
      schedules: {
        create: [
          {
            availableFromWeekDay: 1,
            availableToWeekDay: 3,
            availableFromTime: '08:00:00',
            availableToTime: '12:00:00',
          },
          {
            availableFromWeekDay: 1,
            availableToWeekDay: 3,
            availableFromTime: '14:00:00',
            availableToTime: '18:00:00',
          },
        ],
      },
    },
  });


  const paciente1 = await prisma.patient.create({
    data: {
      name: 'João da Silva',
      email: 'joao.silva@example.com',
      phone: '(11) 91234-5678',
    },
  });

  const paciente2 = await prisma.patient.create({
    data: {
      name: 'Maria Oliveira',
      email: 'maria.oliveira@example.com',
      phone: '(21) 99876-5432',
    },
  });

  console.log({ medico1, medico2, medico3, medico4, paciente1, paciente2 });
  console.log('Seed concluído.');
}

main()
  .catch((e) => {
    console.error(e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });
