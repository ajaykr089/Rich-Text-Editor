/**
 * PluginLoader - Dynamic plugin loading and resolution
 */

import { Plugin } from '../plugins/Plugin';

export interface PluginLoadConfig {
  mode?: 'local' | 'api' | 'hybrid';
  apiUrl?: string;
  fallbackToLocal?: boolean;
}

export class PluginLoader {
  private loadedPlugins: Map<string, Plugin> = new Map();
  private pluginRegistry: Map<string, () => Plugin | Promise<Plugin>> = new Map();

  /**
   * Register a plugin factory (sync or async)
   */
  register(name: string, factory: () => Plugin | Promise<Plugin>): void {
    this.pluginRegistry.set(name, factory);
  }

  /**
   * Load a plugin by name (async)
   */
  async load(name: string, config?: PluginLoadConfig): Promise<Plugin | null> {
    // Check if already loaded
    if (this.loadedPlugins.has(name)) {
      return this.loadedPlugins.get(name)!;
    }
    
    // Check if registered
    const factory = this.pluginRegistry.get(name);
    if (!factory) {
      console.warn(`Plugin not found: ${name}`);
      return null;
    }
    
    // Create plugin instance (may be async)
    const plugin = await factory();
    
    // Apply config if provided
    if (config) {
      this.applyPluginConfig(plugin, config);
    }
    
    this.loadedPlugins.set(name, plugin);
    return plugin;
  }

  /**
   * Load multiple plugins
   */
  async loadMultiple(names: string[], config?: PluginLoadConfig): Promise<Plugin[]> {
    const plugins = await Promise.all(
      names.map(name => this.load(name, config))
    );
    return plugins.filter((p): p is Plugin => p !== null);
  }

  /**
   * Parse plugin string "lists link image media"
   */
  async parsePluginString(pluginString: string, config?: PluginLoadConfig): Promise<Plugin[]> {
    const names = pluginString.split(/\s+/).filter(Boolean);
    return this.loadMultiple(names, config);
  }

  /**
   * Apply configuration to plugin
   */
  private applyPluginConfig(plugin: Plugin, config: PluginLoadConfig): void {
    // Store config on plugin instance for runtime use
    (plugin as any).__pluginConfig = config;
  }

  /**
   * Unload a plugin
   */
  unload(name: string): void {
    this.loadedPlugins.delete(name);
  }

  /**
   * Clear all loaded plugins
   */
  clear(): void {
    this.loadedPlugins.clear();
  }

  /**
   * Get all loaded plugins
   */
  getLoadedPlugins(): Plugin[] {
    return Array.from(this.loadedPlugins.values());
  }

  /**
   * Get all registered plugin names (available for loading)
   */
  getRegisteredPluginNames(): string[] {
    return Array.from(this.pluginRegistry.keys());
  }

  /**
   * Check if plugin is loaded
   */
  isLoaded(name: string): boolean {
    return this.loadedPlugins.has(name);
  }
}
