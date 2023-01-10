import { CanActivate, ExecutionContext, ForbiddenException, Injectable } from "@nestjs/common";
import { PrismaService } from "src/prisma/prisma.service";

@Injectable()
export class OwnedAppointment implements CanActivate {
  constructor(private prisma: PrismaService) { }

  async canActivate(context: ExecutionContext): Promise<boolean> {
    const req = context.switchToHttp().getRequest();

    const { email } = req.user;
    const appointmentId = req.params.id;

    try {
      const user = await this.prisma.user.findUnique({ where: { email } });
      const appointment = await this.prisma.appointment.findUnique({
        where: {
          id: appointmentId
        }
      });

      if (!appointment || !user) {
        throw new ForbiddenException("You are not authorized to access this appointment.");
      }

      return appointment.clientId === user.id;
    } catch (e) {
      throw new ForbiddenException("You are not authorized to access this appointment.");
    }
  }
}
