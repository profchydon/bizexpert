import {
  Controller,
  Get,
  Post,
  Body,
  Param,
  Query,
  UseGuards,
  Res,
} from "@nestjs/common";
import { Response } from "express";
import { ApiTags, ApiBearerAuth, ApiOperation } from "@nestjs/swagger";
import { JwtAuthGuard } from "../common/guards/jwt-auth.guard";
import { BusinessAccessGuard } from "../common/guards/business-access.guard";
import { RolesGuard } from "../common/guards/roles.guard";
import { Roles } from "../common/decorators/roles.decorator";
import { ROLES_THAT_CAN_SELL } from "../common/role-access";
import { CurrentUser } from "../common/decorators/current-user.decorator";
import { User } from "../entities/user.entity";
import { SaleSource } from "../common/enums";
import { SalesService } from "./sales.service";
import { DocumentsService } from "../documents/documents.service";
import { WhatsappService } from "../whatsapp/whatsapp.service";
import { formatNGN } from "../common/utils/decimal.util";
import { CreateSaleDto } from "./dto/create-sale.dto";
import { SaleQueryDto } from "./dto/sale-query.dto";
import { CancelSaleDto } from "./dto/cancel-sale.dto";
import { RefundDto } from "./dto/refund.dto";
import { AddPaymentDto } from "./dto/add-payment.dto";

@ApiTags("Sales")
@ApiBearerAuth()
@UseGuards(JwtAuthGuard, BusinessAccessGuard)
@Controller("businesses/:businessId/sales")
export class SalesController {
  constructor(
    private readonly salesService: SalesService,
    private readonly documentsService: DocumentsService,
    private readonly whatsappService: WhatsappService,
  ) {}

  @Post()
  @Roles(...ROLES_THAT_CAN_SELL)
  @UseGuards(RolesGuard)
  @ApiOperation({ summary: "Create a sale" })
  create(
    @CurrentUser() user: User,
    @Param("businessId") businessId: string,
    @Body() dto: CreateSaleDto,
  ) {
    return this.salesService.createSale(
      businessId,
      user.id,
      dto,
      SaleSource.WEB,
    );
  }

  @Get()
  @ApiOperation({ summary: "List sales" })
  findAll(
    @Param("businessId") businessId: string,
    @Query() query: SaleQueryDto,
  ) {
    return this.salesService.findAll(businessId, query);
  }

  @Get(":id/invoice")
  @ApiOperation({ summary: "Download sale invoice PDF" })
  async invoice(
    @Param("businessId") businessId: string,
    @Param("id") id: string,
    @Res() res: Response,
  ) {
    const pdf = await this.documentsService.generateSaleInvoicePdf(
      id,
      businessId,
    );
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename="invoice-${id}.pdf"`,
    );
    res.send(pdf);
  }

  @Post(":id/share-whatsapp")
  @ApiOperation({
    summary: "Send invoice summary to customer WhatsApp (E.164 phone)",
  })
  async shareWhatsapp(
    @Param("businessId") businessId: string,
    @Param("id") id: string,
    @Body() body: { phone: string },
  ) {
    const sale = await this.salesService.findOne(id, businessId);
    const lines = (sale.saleItems ?? [])
      .map(
        (i) => `${i.productName} × ${i.quantity} = ${formatNGN(i.lineTotal)}`,
      )
      .join("\n");
    const msg =
      `🧾 ${sale.saleNumber}\n` +
      `${lines}\n` +
      `Total: ${formatNGN(sale.totalAmount)}\n` +
      `Payment: ${sale.paymentStatus}`;
    await this.whatsappService.sendMessage(body.phone.replace("+", ""), msg);
    return { sent: true };
  }

  @Get(":id")
  @ApiOperation({ summary: "Get a single sale" })
  findOne(@Param("businessId") businessId: string, @Param("id") id: string) {
    return this.salesService.findOne(id, businessId);
  }

  @Post(":id/cancel")
  @ApiOperation({ summary: "Cancel a sale and reverse inventory" })
  cancel(
    @CurrentUser() user: User,
    @Param("businessId") businessId: string,
    @Param("id") id: string,
    @Body() dto: CancelSaleDto,
  ) {
    return this.salesService.cancelSale(id, businessId, user.id, dto);
  }

  @Post(":id/refund")
  @ApiOperation({ summary: "Refund a sale" })
  refund(
    @CurrentUser() user: User,
    @Param("businessId") businessId: string,
    @Param("id") id: string,
    @Body() dto: RefundDto,
  ) {
    return this.salesService.processRefund(id, businessId, user.id, dto);
  }

  @Post(":id/payments")
  @ApiOperation({ summary: "Add a payment to a sale" })
  addPayment(
    @Param("businessId") businessId: string,
    @Param("id") id: string,
    @Body() dto: AddPaymentDto,
  ) {
    return this.salesService.addPayment(id, businessId, dto);
  }
}
