import Congregation from '#models/congregation'
import { BaseTransformer } from '@adonisjs/core/transformers'

export default class CongregationTransformer extends BaseTransformer<Congregation> {
  toObject() {
    return {
      number: this.resource.number,
      name: this.resource.name,
    }
  }
}
