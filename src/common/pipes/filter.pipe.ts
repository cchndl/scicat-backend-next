import { PipeTransform, Injectable, ArgumentMetadata } from "@nestjs/common";

@Injectable()
export class FilterPipe
  implements
    PipeTransform<
      { filter?: string; fields?: string },
      { filter?: string; fields?: string }
    >
{
  transform(
    inValue: { filter?: string; fields?: string },
    metadata: ArgumentMetadata,
  ): { filter?: string; fields?: string } {
    /*
     * intercept filter and make sure to convert loopback operators to mongo operators
     */
    console.log("Filter pipe ---------");
    console.log(inValue);
    const outValue = inValue;
    if (inValue.filter) {
      let filter = inValue.filter;
      // subsitute the loopback operators to mongo equivalent
      // nin => $in
      // eslint-disable-next-line @typescript-eslint/quotes
      filter = filter.replace(/{"inq":/g, '{"$in":');
      // nin => $nin
      // eslint-disable-next-line @typescript-eslint/quotes
      filter = filter.replace(/{"nin":/g, '{"$nin":');
      // and => $and
      // eslint-disable-next-line @typescript-eslint/quotes
      filter = filter.replace(/{"and":\[/g, '{"$and":[');
      // and => $or
      // eslint-disable-next-line @typescript-eslint/quotes
      filter = filter.replace(/{"or":\[/g, '{"$or":[');
      outValue.filter = filter;
    }
    console.log("Output :" + JSON.stringify(outValue));
    return outValue;
  }
}