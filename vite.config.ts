import { defineConfig, mergeConfig, type UserConfigExport } from 'vite'
import type { DeepPartial } from 'tsdef'
// HACK: there doesn't seem to be a way to get json intellisense and properly generated declarations at the same time.
// @ts-expect-error disable editor warnings, the compiled output for this is correct.
import pkg from './package.json'

export const pkgName = pkg.name
const name = pkgName.charAt(0).toUpperCase() + pkgName.slice(1)
const banner = `/*!
* ${name} v${pkg.version} (${pkg.homepage})
* Copyright 2020-${new Date().getFullYear()} ${pkg.author}
* Licensed under ${pkg.license} (${pkg.repository.replace('.git', '')}/blob/master/LICENSE)
*/`

export const sharedConfig = defineConfig({
	build: {
		sourcemap: false,
		lib: {
			formats: ['es', 'umd'],
			entry: pkg.source,
			name,
		},
		rollupOptions: {
			external: ['bootstrap'],
			output: {
				banner,
			},
		},
	},
})

export default mergeConfig(sharedConfig, (<UserConfigExport>{
	build: {
		minify: false,
		lib: {
			fileName: (format) => `${pkgName}${format === 'es' ? '.module' : ''}.js`,
		},
		rollupOptions: {
			output: {
				// HACK: this won't work with more than one (s)css file.
				assetFileNames: 'tagin[extname]',
			},
		},
	},
}) as DeepPartial<UserConfigExport>)
