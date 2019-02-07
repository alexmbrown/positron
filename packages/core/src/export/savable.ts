/**
 * <code>Savable</code> is an interface for objects that can be serialized.
 */
import { Exporter } from './exporter';
import { Importer } from './importer';

export interface Savable {
  write(ex: Exporter): void;
  read(im: Importer): void;
}
