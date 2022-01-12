import { Request, Response, Router } from 'express';
import { NotFoundError } from '@shuratickets/common';

import { Ticket } from '../models/ticket';

const router = Router();

router.get(
  '/api/tickets/:id', 
  async (req: Request, res: Response) => {
    const ticket = await Ticket.findById(req.params.id);
    if(!ticket){
      throw new NotFoundError()
    }

    res.send(ticket);
  }
);

export { router as showTicketRouter }