<template>
    <nav class="pagination" :class="rootClasses">
        <n-link
            role="button"
            :to="'?page=' + (current - 1)"
            class="pagination-previous"
            :disabled="!hasPrev"
            @click.prevent="prev()"
            :aria-label="ariaPreviousLabel">
            <b-icon icon="chevron-left" :pack="iconPack" both aria-hidden="true"/>
        </n-link>
        <n-link
            role="button"
            :to="'?page=' + (current + 1)"
            class="pagination-next"
            :disabled="!hasNext"
            @click.prevent="next()"
            :aria-label="ariaNextLabel">
            <b-icon icon="chevron-right" :pack="iconPack" both aria-hidden="true"/>
        </n-link>
        <ul class="pagination-list" v-if="!simple">
            <!--First-->
            <li v-if="hasFirst">
                <n-link
                    role="button"
                    to="?page=1"
                    class="pagination-link"
                    @click.prevent="first"
                    :aria-label="getAriaPageLabel(1, false)">
                    1
                </n-link>
            </li>
            <li v-if="hasFirstEllipsis"><span class="pagination-ellipsis">&hellip;</span></li>

            <!--Pages-->
            <li v-for="page in pagesInRange" :key="page.number">
                <n-link
                    role="button"
                    :to="'?page=' + page.number"
                    class="pagination-link"
                    :class="{ 'is-current': page.isCurrent }"
                    @click.prevent="page.click"
                    :aria-label="getAriaPageLabel(page.number, page.isCurrent)"
                    :aria-current="page.isCurrent">
                    {{ page.number }}
                </n-link>
            </li>

            <!--Last-->
            <li v-if="hasLastEllipsis"><span class="pagination-ellipsis">&hellip;</span></li>
            <li v-if="hasLast">
                <n-link
                    role="button"
                    :to="'?page=' + pageCount"
                    class="pagination-link"
                    @click.prevent="last"
                    :aria-label="getAriaPageLabel(pageCount, false)">
                    {{ pageCount }}
                </n-link>
            </li>
        </ul>
        <small class="info" v-if="simple">
            <template v-if="perPage == 1">
                {{ firstItem }} / {{ total }}
            </template>
            <template v-else>
                {{ firstItem }}-{{ Math.min(current * perPage, total) }} / {{ total }}
            </template>
        </small>
    </nav>
</template>

<script>

    export default {
        name: 'FPagination',
        props: {
            total: [Number, String],
            perPage: {
                type: [Number, String],
                default: 20
            },
            current: {
                type: [Number, String],
                default: 1
            },
            rangeBefore: {
                type: [Number, String],
                default: 1
            },
            rangeAfter: {
                type: [Number, String],
                default: 1
            },
            size: String,
            simple: Boolean,
            rounded: Boolean,
            order: String,
            iconPack: String,
            ariaNextLabel: String,
            ariaPreviousLabel: String,
            ariaPageLabel: String,
            ariaCurrentLabel: String
        },
        computed: {
            rootClasses() {
                return [
                    this.order,
                    this.size,
                    {
                        'is-simple': this.simple,
                        'is-rounded': this.rounded
                    }
                ]
            },

            beforeCurrent() {
                return parseInt(this.rangeBefore)
            },

            afterCurrent() {
                return parseInt(this.rangeAfter)
            },

            /**
             * Total page size (count).
             */
            pageCount() {
                return Math.ceil(this.total / this.perPage)
            },

            /**
             * First item of the page (count).
             */
            firstItem() {
                const firstItem = this.current * this.perPage - this.perPage + 1
                return firstItem >= 0 ? firstItem : 0
            },

            /**
             * Check if previous button is available.
             */
            hasPrev() {
                return this.current > 1
            },

            /**
             * Check if first page button should be visible.
             */
            hasFirst() {
                return this.current >= (2 + this.beforeCurrent)
            },

            /**
             * Check if first ellipsis should be visible.
             */
            hasFirstEllipsis() {
                return this.current >= (this.beforeCurrent + 4)
            },

            /**
             * Check if last page button should be visible.
             */
            hasLast() {
                return this.current <= this.pageCount - (1 + this.afterCurrent)
            },

            /**
             * Check if last ellipsis should be visible.
             */
            hasLastEllipsis() {
                return this.current < this.pageCount - (2 + this.afterCurrent)
            },

            /**
             * Check if next button is available.
             */
            hasNext() {
                return this.current < this.pageCount
            },

            /**
             * Get near pages, 1 before and 1 after the current.
             * Also add the click event to the array.
             */
            pagesInRange() {
                if (this.simple) return

                let left = Math.max(1, this.current - this.beforeCurrent)
                if (left - 1 === 2) {
                    left-- // Do not show the ellipsis if there is only one to hide
                }
                let right = Math.min(this.current + this.afterCurrent, this.pageCount)
                if (this.pageCount - right === 2) {
                    right++ // Do not show the ellipsis if there is only one to hide
                }

                const pages = []
                for (let i = left; i <= right; i++) {
                    pages.push({
                        number: i,
                        isCurrent: this.current === i,
                        click: (event) => {
                            if (this.current === i) return
                            this.$emit('change', i)
                            this.$emit('update:current', i)

                            // Set focus on element to keep tab order
                            this.$nextTick(() => event.target.focus())
                        }
                    })
                }
                return pages
            }
        },
        watch: {
            /**
             * If current page is trying to be greater than page count, set to last.
             */
            pageCount(value) {
                if (this.current > value) this.last()
            }
        },
        methods: {
            /**
             * Previous button click listener.
             */
            prev() {
                if (!this.hasPrev) return
                this.$emit('change', this.current - 1)
                this.$emit('update:current', this.current - 1)
            },

            /**
             * First button click listener.
             */
            first() {
                this.$emit('change', 1)
                this.$emit('update:current', 1)
            },

            /**
             * Last button click listener.
             */
            last() {
                this.$emit('change', this.pageCount)
                this.$emit('update:current', this.pageCount)
            },

            /**
             * Next button click listener.
             */
            next() {
                if (!this.hasNext) return
                this.$emit('change', this.current + 1)
                this.$emit('update:current', this.current + 1)
            },

            /**
             * Get text for aria-label according to page number.
             */
            getAriaPageLabel(pageNumber, isCurrent) {
                if (this.ariaPageLabel && (!isCurrent || !this.ariaCurrentLabel)) {
                    return this.ariaPageLabel + ' ' + pageNumber + '.'
                } else if (this.ariaPageLabel && isCurrent && this.ariaCurrentLabel) {
                    return this.ariaCurrentLabel + ', ' + this.ariaPageLabel + ' ' + pageNumber + '.'
                }
                return null
            }
        }
    }
</script>
